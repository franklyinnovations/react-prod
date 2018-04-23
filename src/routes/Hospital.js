import React from "react";
import ReactDOM from "react-dom";
import { imageUrl } from "../../api/config";
import { connect } from "react-redux";
import actions from "../redux/actions";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import Document from "../components/Document";
import HospitalInformation from "../components/HospitalInformation";
//import GMap from '../components/Common/GoogleMap';
import Shift from "../components/Shift";
import LinkDoctor from "../components/LinkDoctor";
import Select from "../components/Select";
import makeTranslater from "../translate";
import { makeApiData } from "../api";
import {
	getStatusLabel,
	getClaimStatusLabel,
	getVerificationStatusLabel,
	text_truncate
} from "../utils";
import Gmap from "../components/Common/Gmap";
var _ = require("lodash");
import {
	Row,
	Col,
	Grid,
	Panel,
	Table,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Icon,
	Button,
	Form,
	FormGroup,
	ControlLabel,
	InputGroup,
	FormControl,
	Checkbox,
	HelpBlock,
	Image,
	Tabs,
	Tab,
	Modal,
	OverlayTrigger,
	Tooltip,
	Popover
} from "@sketchpixy/rubix";
import url from "url";
const viewName = "hospital";
@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.hospital
}))
export default class Hospital extends React.Component {
	constructor(props) {
		super(props);

		this.handleDataUpdate = event => {
			let value;
			if (event.target.type === "checkbox") value = event.target.checked;
			else value = event.target.value;
			this.updateData(event.target.name, value);
		};
		this.handleCountyUpdate = event => {
			let value;
			value = event.target.value;
			this.updateData(event.target.name, value);
			this.countryOnChange(event.target.name, value);

			var index = event.target.selectedIndex;
			var optionElement = event.target.childNodes[index];
			var country_name = optionElement.getAttribute("data-name");
			this.updateGoogleMapAdressData("country_name", country_name);
		};
		this.handleStateUpdate = event => {
			let value;
			value = event.target.value;
			this.updateData(event.target.name, value);
			this.stateOnChange(event.target.name, value);

			var index = event.target.selectedIndex;
			var optionElement = event.target.childNodes[index];
			var state_name = optionElement.getAttribute("data-name");
			this.updateGoogleMapAdressData("state_name", state_name);
		};
		this.handleCityUpdate = event => {
			let value;
			value = event.target.value;
			this.updateData(event.target.name, value);

			var index = event.target.selectedIndex;
			var optionElement = event.target.childNodes[index];
			var city_name = optionElement.getAttribute("data-name");
			this.updateGoogleMapAdressData("city_name", city_name);
		};
		this.handleEdit = event => {
			this.edit(event.target.getAttribute("data-item-id"));
		};
		this.handleState = event => {
			this.changeStatus(
				event.target.getAttribute("data-item-id"),
				event.target.getAttribute("data-item-status") === "1" ? "0" : "1"
			);
		};

		this.handleViewClaimRequestDetail = event => {
			event.preventDefault();

			let dataItemId =
				"SPAN" === event.target.nodeName
					? event.target.parentNode.getAttribute("data-item-id")
					: event.target.getAttribute("data-item-id");
			this.props.dispatch(
				actions.hospital.viewClaimRequestDetail(this.props, dataItemId)
			);
			this.setState({ claimRequestDetailModalVisibleState: true });
		};

		this.handleClaimRequest = event => {
			let action_type = event.target.getAttribute("data-action-type");
			this.props.dispatch(
				actions.hospital.handleClaimRequest(this.props, action_type)
			);
		};

		this.handlePendingVerifiedStatus = event => {
			event.preventDefault();
			let hospitalId = event.target.getAttribute("data-item-id");
			vex.dialog.open({
				message: window.__("Are you sure ?"),
				buttons: [
					$.extend({}, vex.dialog.buttons.YES, { text: window.__("Yes") }),
					$.extend({}, vex.dialog.buttons.NO, { text: window.__("Cancel") })
				],
				callback: status => {
					if (status) {
						this.props.dispatch(
							actions.hospital.verifystatus(this.props, hospitalId)
						);
					}
				}
			});
		};

		this.handleAddMoreEmailMobile = event => {
			event.preventDefault();
			this.props.dispatch(
				actions.hospital.addMoreEmailMobile(
					this.props,
					event.target.getAttribute("data-type")
				)
			);
		};

		this.handleContactDataUpdate = event => {
			if (event.target.getAttribute("data-action-type") === "is_primary") {
				let targetName = event.target.name.split("__")[0];
				this.props.dispatch(
					actions.hospital.updateEmailMobile(
						this.props,
						event.target.getAttribute("data-type"),
						event.target.getAttribute("data-index"),
						targetName,
						1
					)
				);
			} else {
				this.props.dispatch(
					actions.hospital.updateEmailMobile(
						this.props,
						event.target.getAttribute("data-type"),
						event.target.getAttribute("data-index"),
						event.target.name,
						event.target.value
					)
				);
			}
		};

		this.handleRemoveContactEmailMobile = event => {
			this.props.dispatch(
				actions.hospital.removeEmailMobile(
					this.props,
					event.target.getAttribute("data-type"),
					event.target.getAttribute("data-index")
				)
			);
		};

		this.hendleProfilePicUploadIconClick = () => {
			let getElem = ReactDOM.findDOMNode(this).querySelector(".profile-pic");
			getElem.click();
		};

		this.handleProfilePicChange = event => {
			if (event.target.files && event.target.files[0]) {
				if (
					-1 === ["image/jpeg", "image/png"].indexOf(event.target.files[0].type)
				) {
					Messenger().post({
						type: "error",
						message: window.__("Only images are allowed")
					});
					return false;
				}
				let reader = new FileReader();
				reader.onload = e => {
					let getImgElem = ReactDOM.findDOMNode(this).querySelector(
						".prf-pic-img-preview"
					);

					getImgElem.src = e.target.result;
					//this.setState({image: e.target.result});
				};
				reader.readAsDataURL(event.target.files[0]);
			}
		};

		this.closeClaimRequestDetailModal = () => {
			this.props.dispatch({
				type: "CLOSE_MODAL"
			});
		};

		this.changeTabKey = event => {
			this.props.dispatch(
				actions.hospital.updateTabKey(event.target.getAttribute("data-tab-key"))
			);
		};

		this.handleSelect = key => {
			if (key === undefined) return;
			this.props.dispatch(actions.hospital.updateTabKey(key));
		};
	}
	static fetchData(store) {
		return store.dispatch(actions.hospital.init(store.getState()));
	}

	componentWillReceiveProps(nextProps){
		if(this.props.activeTabKey !== nextProps.activeTabKey){
			$(window).scrollTop(0);
		}
	}

	render() {
		let modalVisible = this.props.claimRequestDetail.modalDisplay;
		if (this.props.loading) return <Loading />;
		let content,
			__ = makeTranslater(this.props.translations, this.props.lang.code);
		switch (this.props.viewState) {
			case "DATA_FORM":
				content = this.renderAdd(__);
				break;
			default:
				content = this.renderList(__);
		}
		return (
			<Row>
				<Col sm={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className="bg-green">
								<Grid>
									<Row>
										<Col xs={4} md={10} className="fg-white">
											<h3>{__("Hospital")}</h3>
										</Col>
										<Col xs={8} md={2}>
											<h3>
												{this.props.viewState === "LIST" && (
													<Button
														inverse
														outlined
														style={{ marginBottom: 5 }}
														bsStyle="default"
														onClick={::this.startAddNew}
													>
														{__("Add New")}
													</Button>
												)}
												{this.props.viewState === "DATA_FORM" && (
													<Button
														inverse
														outlined
														style={{ marginBottom: 5 }}
														bsStyle="default"
														onClick={::this.viewList}
													>
														{__("View List")}
													</Button>
												)}
											</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>{content}</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
				<Col xs={12}>
					<Modal show={modalVisible} onHide={this.closeClaimRequestDetailModal}>
						<Modal.Header closeButton>
							<Modal.Title>{__('Claim Request by')}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{this.props.claimRequestDetail.isLoading && (
								<p>{__('Loading details')}.....</p>
							)}
							{!this.props.claimRequestDetail.isLoading &&
								null !== this.props.claimRequestDetail.data && (
									<Row>
										<Col sm={12}>
											<p>
												<strong>{__('Name')}</strong> :{" "}
												{
													this.props.claimRequestDetail.data.user.userdetails[0]
														.fullname
												}
											</p>
											<p>
												<strong>{__('Email')}</strong> :{" "}
												{this.props.claimRequestDetail.data.user.email}
											</p>
											<p>
												<strong>{__('Mobile')}</strong> :{" "}
												{this.props.claimRequestDetail.data.user.mobile}
											</p>
										</Col>
									</Row>
								)}
						</Modal.Body>
						<Modal.Footer>
							<Button
								bsStyle="danger"
								disabled={this.props.claimRequestDetail.isLoading}
								data-action-type="rejected"
								onClick={this.handleClaimRequest}
							>
								{__('Reject')}
							</Button>
							<Button
								bsStyle="primary"
								disabled={this.props.claimRequestDetail.isLoading}
								data-action-type="approved"
								onClick={this.handleClaimRequest}
							>
								{__('Approve')}
							</Button>
						</Modal.Footer>
					</Modal>
				</Col>
			</Row>
		);
	}

	renderList(__) {
		return (
			<Row key="hospital-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th>{__("S No.")}</th>
								<th>{__("Hospital Name")}</th>
								<th>{__("ClaimStatus")}</th>
								<th>{__("Status")}</th>
								<th>{__("VerificationStatus")}</th>
								<th>{__("Live")}</th>
								<th>{__("Actions")}</th>
							</tr>
							{
								<tr>
									<td />
									<td>
										<FormControl
											type="text"
											onChange={this.makeFilter(
												"hospitaldetail__hospital_name"
											)}
											value={
												this.props.filter.hospitaldetail__hospital_name || ""
											}
											placeholder={__("Hospital Name")}
										/>
									</td>
									<td>
										<FormControl
											componentClass="select"
											placeholder="select"
											onChange={this.makeFilter("hospital__claim_status")}
											value={this.props.filter.hospital__claim_status || ""}
										>
											<option value="">{__("Select")}</option>
											<option value="non-claimed">{__("Not Claimed")}</option>
											<option value="pending">{__("Pending")}</option>
											<option value="approved">{__("Approved")}</option>
											<option value="user-created">{__("User Created")}</option>
											<option value="rejected">{__("Rejected")}</option>
										</FormControl>
									</td>
									<td>
										<FormControl
											componentClass="select"
											placeholder="select"
											onChange={this.makeFilter("hospital__is_active")}
											value={this.props.filter.hospital__is_active || ""}
										>
											<option value="">{__("All")}</option>
											<option value="1">{__("Active")}</option>
											<option value="0">{__("Inactive")}</option>
										</FormControl>
									</td>
									<td>
										<FormControl
											componentClass="select"
											placeholder="select"
											onChange={this.makeFilter("hospital__verified_status")}
											value={this.props.filter.hospital__verified_status || ""}
										>
											<option value="">{__("Select")}</option>
											<option value="pending">{__("Pending")}</option>
											<option value="verified">{__("Verified")}</option>
											<option value="incomplete-profile">
												{__("Incomplete Profile")}
											</option>
										</FormControl>
									</td>
									<td>
										<FormControl
											componentClass="select"
											placeholder="select"
											onChange={this.makeFilter("hospital__is_live")}
											value={this.props.filter.hospital__is_live || ""}
										>
											<option value="">{__("Select")}</option>
											<option value="0">{__("Not Live")}</option>
											<option value="1">{__("Live")}</option>
										</FormControl>
									</td>
									<td>
										<Icon
											className={"fg-darkcyan"}
											style={{ fontSize: 20 }}
											glyph={"icon-feather-search"}
											onClick={::this.search}
										/>
										<Icon
											className={"fg-brown"}
											style={{ fontSize: 20 }}
											glyph={"icon-feather-reload"}
											onClick={::this.reset}
										/>
									</td>
								</tr>
							}
						</thead>
						<tbody>
							{this.props.hospitals.map(this.getDataRow, this)}
							{this.props.hospitals.length === 0 && this.getNoDataRow(__)}
						</tbody>
					</Table>
				</Col>
				<Col xs={12}>
					<Pagination data={this.props.pageInfo} onSelect={::this.changePage} />
				</Col>
			</Row>
		);
	}

	renderAdd(__) {
		return (
			<Col xs={12} md={12} lg={12}>
				<Tabs
					activeKey={this.props.activeTabKey}
					onSelect={this.handleSelect}
					id="controlled-tab-example"
				>
					<Tab
						eventKey={"basic_info"}
						title={this.props.hospital.id ? __("Hospital Details") : __("Add Hospital")}
					>
						<Row>
							<Form>
								<br />
								<Row>
									<Col xs={4} md={4}>
										<FormGroup
											controlId="name"
											validationState={
												this.props.errors.hospital_name ? "error" : null
											}
										>
											<ControlLabel>{__("Hospital Name")}</ControlLabel>
											<FormControl
												type="text"
												placeholder={__("Hospital Name")}
												value={
													this.props.hospital["hospital_detail[hospital_name]"]
												}
												name="hospital_detail[hospital_name]"
												onChange={this.handleDataUpdate}
											/>
											<HelpBlock>{this.props.errors.hospital_name}</HelpBlock>
										</FormGroup>
									</Col>
									<Col xs={4} md={4}>
										<Image
											src={
												this.props.hospital.hospital_logo
													? imageUrl + "/" + this.props.hospital.hospital_logo
													: "/imgs/noimage.png"
											}
											thumbnail
											style={{ maxHeight: "100px" }}
											className="prf-pic-img-preview"
										/>
										<FormGroup
											controlId="name"
											validationState={
												this.props.errors.hospital_logo ? "error" : null
											}
										>
											<div>
												<Icon className={"fg-blue"} style={{ fontSize: 28 }}>
													<span
														style={{ fontSize: 14 }}
														className={"fg-blue"}
														onClick={this.hendleProfilePicUploadIconClick}
													>
														{__("Upload Hospital Logo")}
													</span>
													<input
														type="file"
														className="hide profile-pic"
														name="hospital_logo"
														onChange={this.handleProfilePicChange}
													/>
												</Icon>

												<HelpBlock>{this.props.errors.hospital_logo}</HelpBlock>
											</div>
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col sm={12}>
										<h4>{__('Contact Details')}</h4>
									</Col>
									<Col sm={6}>
										<Row>
											<Col sm={12}>
												<FormGroup>
													<ControlLabel>{__("Email")} </ControlLabel>
												</FormGroup>
											</Col>
											{this.props.contactInformations.emails.map(
												(item, itemIndex) => (
													<div key={"contact-email-" + itemIndex}>
														<Col sm={itemIndex === 0 ? 12 : 10}>
															<FormGroup
																controlId={"email___" + itemIndex}
																validationState={
																	this.props.errors["email___" + itemIndex]
																		? "error"
																		: null
																}
															>
																<InputGroup>
																	<FormControl
																		type="text"
																		placeholder={__("Email")}
																		value={
																			this.props.contactInformations.emails[
																				itemIndex
																			].value
																		}
																		name="value"
																		onChange={this.handleContactDataUpdate}
																		data-index={itemIndex}
																		data-type="emails"
																		data-action-type="info"
																	/>
																	<InputGroup.Addon>
																		<input
																			type="radio"
																			data-action-type="is_primary"
																			name="is_primary__email"
																			data-type="emails"
																			data-index={itemIndex}
																			onChange={this.handleContactDataUpdate}
																			checked={
																				this.props.contactInformations.emails[
																					itemIndex
																				].is_primary === 1
																					? true
																					: false
																			}
																		/>
																	</InputGroup.Addon>
																</InputGroup>
																<HelpBlock>
																	{this.props.errors["email___" + itemIndex]}
																</HelpBlock>
															</FormGroup>
														</Col>
														{itemIndex != 0 && (
															<Col sm={2}>
																<Icon
																	className={"fg-deepred"}
																	style={{ fontSize: 20 }}
																	glyph={"icon-simple-line-icons-close"}
																	data-index={itemIndex}
																	title={__("Remove")}
																	data-type="emails"
																	onClick={this.handleRemoveContactEmailMobile}
																/>
															</Col>
														)}
													</div>
												)
											)}
											{this.props.contactInformations.emails.length < 3 && (
												<Col sm={12} className="text-right">
													<a
														href="#"
														onClick={this.handleAddMoreEmailMobile}
														data-type="email"
													>
														+ {__('Add More')}
													</a>
												</Col>
											)}
										</Row>
									</Col>
									<Col sm={6}>
										<Row>
											<Col sm={12}>
												<FormGroup>
													<ControlLabel>{__("Mobile")} </ControlLabel>
												</FormGroup>
											</Col>
											{this.props.contactInformations.mobiles.map(
												(item, itemIndex) => (
													<div key={"contact-mobile-" + itemIndex}>
														<Col sm={itemIndex === 0 ? 12 : 10}>
															<FormGroup
																controlId={"mobile___" + itemIndex}
																validationState={
																	this.props.errors["mobile___" + itemIndex]
																		? "error"
																		: null
																}
															>
																<InputGroup>
																	<FormControl
																		type="text"
																		placeholder={__("Mobile")}
																		value={
																			this.props.contactInformations.mobiles[
																				itemIndex
																			].value
																		}
																		name="value"
																		onChange={this.handleContactDataUpdate}
																		data-index={itemIndex}
																		data-type="mobiles"
																		data-action-type="info"
																	/>
																	<InputGroup.Addon>
																		<input
																			type="radio"
																			data-action-type="is_primary"
																			name="is_primary__mobile"
																			data-type="mobiles"
																			data-index={itemIndex}
																			onChange={this.handleContactDataUpdate}
																			checked={
																				this.props.contactInformations.mobiles[
																					itemIndex
																				].is_primary === 1
																					? true
																					: false
																			}
																		/>
																	</InputGroup.Addon>
																</InputGroup>
																<HelpBlock>
																	{this.props.errors["mobile___" + itemIndex]}
																</HelpBlock>
															</FormGroup>
														</Col>
														{itemIndex != 0 && (
															<Col sm={2}>
																<Icon
																	className={"fg-deepred"}
																	style={{ fontSize: 20 }}
																	glyph={"icon-simple-line-icons-close"}
																	data-index={itemIndex}
																	title={__("Remove")}
																	data-type="mobiles"
																	onClick={this.handleRemoveContactEmailMobile}
																/>
															</Col>
														)}
													</div>
												)
											)}
											{this.props.contactInformations.mobiles.length < 3 && (
												<Col sm={12} className="text-right">
													<a
														href="#"
														onClick={this.handleAddMoreEmailMobile}
														data-type="mobile"
													>
														+ {__('Add More')}
													</a>
												</Col>
											)}
										</Row>
									</Col>
								</Row>
								<Row>
									<Col xs={12} md={12} lg={12}>
										<FormGroup
											controlId="name"
											validationState={
												this.props.errors.about_hospital ? "error" : null
											}
										>
											<ControlLabel>{__("About Hospital")}</ControlLabel>
											<FormControl
												componentClass="textarea"
												placeholder={__("About Hospital")}
												value={
													this.props.hospital["hospital_detail[about_hospital]"]
												}
												name="hospital_detail[about_hospital]"
												onChange={this.handleDataUpdate}
											/>
											<HelpBlock>{this.props.errors.about_hospital}</HelpBlock>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col xs={6} md={6}>
										<FormGroup
											controlId="countryId"
											validationState={
												this.props.errors.countryId ? "error" : null
											}
										>
											<FormControl
												componentClass="select"
												className="country_id"
												placeholder="select"
												onChange={this.handleCountyUpdate}
												name="countryId"
												value={this.props.hospital.countryId}
											>
												<option value="">{__("Select Country")}</option>
												{this.props.helperData.countries.map((value, index) => (
													<option
														value={value.id}
														key={"country-" + value.id}
														data-name={value.countrydetails[0].name}
													>
														{value.countrydetails[0].name}
													</option>
												))}
											</FormControl>
											<HelpBlock>{this.props.errors.countryId}</HelpBlock>
										</FormGroup>
										<FormGroup
											controlId="stateId"
											validationState={
												this.props.errors.stateId ? "error" : null
											}
										>
											<FormControl
												componentClass="select"
												placeholder="select"
												onChange={this.handleStateUpdate}
												name="stateId"
												value={this.props.hospital.stateId}
											>
												<option value="">{__("Select State")}</option>
												{this.props.helperData.states.map((value, index) => (
													<option
														value={value.id}
														key={"state-" + value.id}
														data-name={value.statedetails[0].name}
													>
														{value.statedetails[0].name}
													</option>
												))}
											</FormControl>
											<HelpBlock>{this.props.errors.stateId}</HelpBlock>
										</FormGroup>
										<FormGroup
											controlId="cityId"
											validationState={
												this.props.errors.cityId ? "error" : null
											}
										>
											<FormControl
												componentClass="select"
												placeholder="select"
												onChange={this.handleCityUpdate}
												name="cityId"
												value={this.props.hospital.cityId}
											>
												<option value="">{__("Select City")}</option>
												{this.props.helperData.cities.map((value, index) => (
													<option
														value={value.id}
														key={"city-" + value.id}
														data-name={value.citydetails[0].name}
													>
														{value.citydetails[0].name}
													</option>
												))}
											</FormControl>
											<HelpBlock>{this.props.errors.cityId}</HelpBlock>
										</FormGroup>

										<FormGroup
											controlId="name"
											validationState={
												this.props.errors.address ? "error" : null
											}
										>
											<FormControl
												componentClass="textarea"
												placeholder={__("Enter Address ( Building code, street name & details )")}
												value={this.props.hospital["hospital_detail[address]"]}
												name="hospital_detail[address]"
												onChange={this.handleDataUpdate}
											/>
											<HelpBlock>{this.props.errors.address}</HelpBlock>
										</FormGroup>

										<FormGroup
											controlId="name"
											validationState={
												this.props.errors.zipcode ? "error" : null
											}
										>
											<FormControl
												type="text"
												placeholder={__("Zipcode")}
												value={this.props.hospital.zipcode}
												name="zipcode"
												onChange={this.handleDataUpdate}
											/>
											<HelpBlock>{this.props.errors.zipcode}</HelpBlock>
										</FormGroup>

										<FormGroup controlId="is_active">
											<Checkbox
												name="is_active"
												onChange={this.handleDataUpdate}
												checked={this.props.hospital.is_active}
											>
												{__("Active")}
											</Checkbox>
										</FormGroup>
									</Col>
									<Col md={6}>
										<Gmap
											//data={this.props}
											address={this.props.hospital["hospital_detail[address]"]}
											country_name={this.props.helperData.country_name}
											state_name={this.props.helperData.state_name}
											city_name={this.props.helperData.city_name}
											base={"doctor"}
										/>
									</Col>
								</Row>
							</Form>

							<Row>
								<Col sm={6}>
									<div>
										<Button
											outlined
											bsStyle="lightgreen"
											onClick={::this.viewList}
										>
											{__("Cancel")}
										</Button>{" "}
									</div>
									<br />
								</Col>
								<Col sm={6} className="text-right">
									<div>
										<Button outlined bsStyle="lightgreen" onClick={::this.save}>
											{__("Save & Next")}
										</Button>
									</div>
									<br />
								</Col>
							</Row>
						</Row>
					</Tab>
					<Tab
						eventKey={"photos_videos"}
						title={__("Photos/Documents")}
						disabled={this.props.hospital.id ? false : true}
					>
						<Row>
							<Col sm={12}>
								<Document data={this.props} />
							</Col>
							<Col sm={6}>
								<div>
									<Button
										outlined
										bsStyle="lightgreen"
										data-tab-key="basic_info"
										onClick={::this.changeTabKey}
									>
										{__("Previous")}
									</Button>{" "}
								</div>
								<br />
							</Col>
							<Col sm={6}>
								<div className="text-right">
									<Button
										outlined
										bsStyle="lightgreen"
										data-tab-key="additional_info"
										onClick={::this.changeTabKey}
									>
										{__("Save & Next")}
									</Button>
								</div>
								<br />
							</Col>
						</Row>
					</Tab>
					<Tab
						eventKey={"additional_info"}
						title={__("Additional Information")}
						disabled={this.props.hospital.id ? false : true}
					>
						<HospitalInformation
							data={this.props}
							changeTabKey={::this.changeTabKey}
						/>
					</Tab>

					<Tab
						eventKey={"hospital_timings"}
						title={__("Hospital Timings")}
						disabled={this.props.hospital.id ? false : true}
					>
						<Shift data={this.props} changeTabKey={::this.changeTabKey} />
					</Tab>

					<Tab
						eventKey={"add_doctors"}
						title={__("Doctors")}
						disabled={this.props.hospital.id ? false : true}
					>
						<br />
						{this.props.hospital.is_freeze == 1 && (
							<LinkDoctor {...this.props} />
						)}
						{this.props.hospital.is_freeze == 0 && (
							<h3 className="text-center">{__('Please freeze your timing first.')} </h3>
						)}
					</Tab>
				</Tabs>
			</Col>
		);
	}

	getDataRowDoc(item, index) {
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<tr key={item.id}>
				<td>{index + 1}</td>
				<td>{item.doctorprofiledetails[0].name}</td>
				<td>{item.email}</td>
				<td>{item.mobile}</td>
				<td>{item.doctor_id}</td>
				<td>{__(getStatusLabel(item.is_active, __))}</td>
				<td>
					<Icon
						className={"fg-brown"}
						style={{ fontSize: 20 }}
						glyph={"icon-simple-line-icons-note"}
						onClick={this.handleEdit}
						data-item-id={item.id}
					/>
					<Icon
						className={item.is_active === 1 ? "fg-deepred" : "fg-darkgreen"}
						style={{ fontSize: 20 }}
						glyph={this.getStatusIcon(item.is_active)}
						onClick={this.handleState}
						data-item-id={item.id}
						data-item-status={item.is_active}
					/>
				</td>
			</tr>
		);
	}

	getDataRow(item, index) {
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		let serialNo =
			this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1);
		return (
			<tr key={item.id}>
				<td>{serialNo + ++index}</td>
				<td>{text_truncate(item.hospitaldetails[0].hospital_name, 20)}</td>
				<td>
					{"pending" === item.claim_status ? (
						<a
							href="#"
							data-item-id={item.id}
							title={__("ViewClaimRequestDetail")}
							onClick={this.handleViewClaimRequestDetail}
						>
							{getClaimStatusLabel(item.claim_status, __)}
						</a>
					) : ("approved" === item.claim_status ||
						"user-created" === item.claim_status) &&
					item.user !== null ? (
						<OverlayTrigger
							placement="top"
							rootClose
							overlay={
								<Popover id={"dp-" + index} title={__('Details of user')}>
									<p>
										<strong>{__('Name')}: </strong> {item.user.userdetails[0].fullname}
									</p>
									<p>
										<strong>{__('Email')}: </strong> {item.user.email}
									</p>
									<p>
										<strong>{__('Mobile')}: </strong> {item.user.mobile}
									</p>
								</Popover>
							}
						>
							<a
								onClick={e => {
									return false;
								}}
							>
								{getClaimStatusLabel(item.claim_status, __)}
							</a>
						</OverlayTrigger>
					) : (
						getClaimStatusLabel(item.claim_status, __)
					)}
				</td>
				<td>{__(getStatusLabel(item.is_active, __))}</td>
				<td>
					{item.userId && "pending" === item.verified_status ? (
						<a
							href="#"
							data-item-id={item.id}
							title={__("ClickToApproveRequest")}
							onClick={this.handlePendingVerifiedStatus}
						>
							{getVerificationStatusLabel(item.verified_status, __)}
						</a>
					) : (
						getVerificationStatusLabel(item.verified_status, __)
					)}
				</td>
				<td>
					{1 === item.is_live ? (
						<Icon
							className={"fg-green"}
							style={{ fontSize: 20 }}
							glyph={"climacon moon new"}
						/>
					) : (
						<Icon
							className={"fg-red"}
							style={{ fontSize: 20 }}
							glyph={"climacon moon new"}
						/>
					)}
				</td>
				<td>
					<Icon
						className={"fg-brown"}
						style={{ fontSize: 20 }}
						glyph={"icon-simple-line-icons-note"}
						onClick={this.handleEdit}
						data-item-id={item.id}
					/>


			

					<Icon
						className={item.is_active === 1 ? "fg-deepred" : "fg-darkgreen"}
						style={{ fontSize: 20 }}
						glyph={this.getStatusIcon(item.is_active)}
						onClick={this.handleState}
						data-item-id={item.id}
						data-item-status={item.is_active}
					/>

					
				</td>
			</tr>
		);
	}

	getStatusIcon(status) {
		switch (status) {
			case 0:
				return "icon-simple-line-icons-check";
			case 1:
				return "icon-simple-line-icons-close";
			case -1:
				return "icon-fontello-spin4";
		}
	}

	getNoDataRow(__) {
		return (
			<tr key={0}>
				<td colSpan={7} className="text-center">
					{__("No data found")}
				</td>
			</tr>
		);
	}

	changePage(page) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	}

	makeFilter(name) {
		let dispatch = this.props.dispatch;
		return event => {
			dispatch({
				type: "UPDATE_FILTER",
				name,
				value: event.target.value
			});
		};
	}

	updateData(name, value) {
		this.props.dispatch({
			type: "UPDATE_DATA_VALUE",
			value,
			name
		});
	}
	countryOnChange(name, value) {
		this.props.dispatch(actions.hospital.countryOnChange(this.props, value));
	}
	stateOnChange(nameone, value) {
		this.props.dispatch(actions.hospital.stateOnChange(this.props, value));
	}
	search() {
		this.props.router.push("/admin/hospital");
	}

	reset() {
		this.props.dispatch({
			type: "RESET_FILTERS"
		});
		this.props.router.push("/admin/hospital");
	}

	startAddNew() {
		this.props.dispatch(actions.hospital.startAdd(this.props));
	}

	viewList() {
		this.props.dispatch(actions.hospital.viewList());
	}

	edit(itemId) {
		this.props.dispatch(actions.hospital.edit(this.props, itemId));
	}

	save(isNext) {
		let data = new FormData(ReactDOM.findDOMNode(this).querySelector("form"));
		if (this.props.hospital.id != "undefined") {
			data.append("id", this.props.hospital.id);
			data.append(
				"hospital_detail[id]",
				this.props.hospital.hospital_detail_id
			);
			data.append(
				"contact_informations",
				JSON.stringify(this.props.contactInformations)
			);
			data.append("latitude", this.props.hospital.latitude);
			data.append("longitude", this.props.hospital.longitude);
		}

		if (isNext) {
			this.props.hospital.isNext = true;
		} else {
			this.props.hospital.isNext = false;
		}

		this.props.dispatch(actions.hospital.save(this.props, data));
	}

	changeStatus(itemId, itemStatus) {
if(itemStatus==0){
vex.dialog.open({
				message: window.__("Are you sure you want to inactive this clinic/Hospital? Please note in this case all Live doctors of this clinic/ hospital also will not be searchable for patients."),
				buttons: [
					$.extend({}, vex.dialog.buttons.YES, { text: window.__("Yes") }),
					$.extend({}, vex.dialog.buttons.NO, { text: window.__("Cancel") })
				],
				callback: status => {
					if(status){
						this.props.dispatch(
							actions.hospital.changeStatus(this.props, itemId, itemStatus)
						);
					}
				}
			});

}else{
				this.props.dispatch(
							actions.hospital.changeStatus(this.props, itemId, itemStatus)
						);
}


		
	}

	updateGoogleMapAdressData(slug, value) {
		this.props.dispatch({
			type: "UPDATE_GMAP_ADDRESS_VALUE",
			slug: slug,
			value: value
		});
	}
}