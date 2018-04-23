import React from 'react';
import ReactDOM from 'react-dom';
import {imageUrl} from '../../api/config'
        import {connect} from 'react-redux';
        import actions from '../redux/actions';
        import Select from '../components/Select';
        import makeTranslater from '../translate';
        import {getStatusLabel,getTagType,serviceTag,specialTag,getYears} from '../utils';
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
                Alert,
                Well,
                BPanel
        } from '@sketchpixy/rubix';
        @connect(state => ({
        session: state.session,
                location: state.location,
                loading: state.view.loading || false,
                translations: state.translations,
                lang: state.lang,
                ...state.view.hospital
        }))

export default class HospitalInformation extends React.Component {
  constructor(props) {
  super(props);
  this.state={
      options : [],
      awardArray:[1]
  }
  this.handleState = event => {
  this.changeStatus(
          event.target.getAttribute('data-item-id'),
          event.target.getAttribute('data-item-status') === '1' ? '0' : '1',
        );
  };
  this.handleDataUpdate = event => {

  let value;
          value = event.target.value;
          this.updateData(event.target.name, value);
  }
  this.addMore = event => {
    var arrayvar = this.state.awardArray.slice()
    arrayvar.push(1)
    this.setState({ awardArray: arrayvar })
  }


  /*=========get awords tags=========*/
  this.yearList = getYears();

  /*=========End of awords companies tags======*/
  this.handleRemoveAward = event => {
    let getIndex = event.target.getAttribute('data-id')
    this.removeAward(getIndex)
  }
  this.handleAwardInputUpdate = event => {
    this.updateAwardInputData(event.target.name, event.target.value, event.target.getAttribute('data-index'));
  }
}

async componentWillMount(){
  /****get all active tag type***/
  var options = await getTagType(this.props);
  this.setState({options : options})
  /*=========get service tags=========*/

var serviceList = await serviceTag(this.props,1);
this.setState({serviceList : serviceList})
  /*=========End of service tags======*/

  /*=========get specialization tags=========*/
  var specialList = await serviceTag(this.props,2);
  this.setState({specialList : specialList})
  /*=========End of specialization tags======*/

  /*=========get Membership tags=========*/
  var memberList = await serviceTag(this.props,12);
this.setState({memberList : memberList})
  /*=========End of Membership tags======*/

  /*=========get insurance companies tags=========*/
  var insuranceList = await serviceTag(this.props,11);
this.setState({insuranceList : insuranceList})
  /*=========End of insurance companies tags======*/


}

	render(){
    let __ = makeTranslater(
            this.props.translations,
            this.props.lang.code
        );
    if(this.props.data.hospital.id==""){
      return (
        <Row key="hospitalfile-list">
  		    <Col xs={12}>
          </Col>
          </Row>
        );
  }else{
    return (

		<Row key="additionalinformation-list">
		    <Col xs={12}>
        <Row>
        <Form className='imageForm'>
          <br/>
        <Row>

          <Col xs={12} md={12} lg={12}>
          <BPanel header={__('Services')}>

          <FormGroup
           controlId='serviceId'
           validationState={this.props.data.errors.serviceId ? 'error': null}
           >
           <Select
              multi
               name="serviceId"
               onChange={this.handleDataUpdate}
               value={this.props.hospital.serviceId}
               options={this.state.serviceList}
               validate={'Required'}
               />
           <HelpBlock>{this.props.data.errors.serviceId}</HelpBlock>
        </FormGroup>
        </BPanel>
</Col>
        </Row>
        <Row>

            <Col xs={12} md={12} lg={12}>
            <BPanel header={__('Specialization')}>
            <FormGroup
             controlId='specialId'
             validationState={this.props.data.errors.specialId ? 'error': null}
             >
             <Select
                multi
                 name="specialId"
                 onChange={this.handleDataUpdate}
                 value={this.props.hospital.specialId}
                 options={this.state.specialList}
                 />
             <HelpBlock>{this.props.data.errors.specialId}</HelpBlock>
            </FormGroup>
            </BPanel>
          </Col>
        </Row>


        <Row>
            <Col xs={12} md={12} lg={12}>
          <BPanel header={__('Memberships')}>
            <FormGroup
             controlId='memberId'
             validationState={this.props.data.errors.memberId ? 'error': null}
             >
             <Select
                multi
                 name="memberId"
                 onChange={this.handleDataUpdate}
                 value={this.props.hospital.memberId}
                 options={this.state.memberList}
                 />
             <HelpBlock>{this.props.data.errors.memberId}</HelpBlock>
            </FormGroup>
            </BPanel>
          </Col>
        </Row>

        <Row>
            <Col xs={12} md={12} lg={12}>
            <BPanel header={__('Insurance Companies')}>
            <FormGroup
             controlId='insuranceId'
             validationState={this.props.data.errors.insuranceId ? 'error': null}
             >

             <Select
                multi
                 name="insuranceId"
                 onChange={this.handleDataUpdate}
                 value={this.props.hospital.insuranceId}
                 options={this.state.insuranceList}
                 />
             <HelpBlock>{this.props.data.errors.insuranceId}</HelpBlock>
            </FormGroup>
            </BPanel>
          </Col>
        </Row>
        <BPanel header={__('Awards')}>
        {this.props.hospitalAwards.map((aword, index) =>
        <Row key={'awrd-'+index}>

            <Col xs={6} md={6}>
            <FormGroup controlId="award_gratitude_title" validationState={this.props.errors['award_gratitude_title_'+index] ? 'error': null} >
                <FormControl
                type='text'
                placeholder={__('Awards/ Gratitude Title')}
                value={this.props.hospitalAwards[index].award_gratitude_title}
                name='award_gratitude_title'
                data-index={index}
                data-action-type={'UPDATE_AWARD_INPUT_VALUE'}
                onChange={this.handleAwardInputUpdate}
              />
              <HelpBlock>{this.props.errors['award_gratitude_title_'+index]}</HelpBlock>
            </FormGroup>
          </Col>
          <Col xs={6} md={4}>
          <FormGroup controlId="award_year" validationState={this.props.errors['award_year_'+index] ? 'error': null} >

              <FormControl
              componentClass="select"
              onChange={this.handleAwardInputUpdate}
              name='award_year'
              value={this.props.hospitalAwards[index].award_year}
              data-index={index}
            >
              <option value="">{__('Award Year')}</option>
              {
                this.yearList.map((value, index) =>
                  <option value={value} key={'year-'+value}>{
                    value
                  }</option>
                )
              }
            </FormControl>
            <HelpBlock>{this.props.errors['award_year_'+index]}</HelpBlock>
            </FormGroup>
              </Col>
          <Col xs={6} md={2} style={{paddingTop: '8px'}}>

          <Icon
            style={{fontSize: 20}}
            className={'fg-danger'}
            glyph={'icon-flatline-trash'}
            data-id={index}
            onClick={this.handleRemoveAward}
          />

          </Col>
        </Row>

      )}
    </BPanel>
        <br/>
        <Row>
        <Col xs={6} md={10}>
&nbsp;
        </Col>
        <Col xs={6} md={2}>
        <div>
        <Button
            bsStyle='primary'
            onClick={::this.addMoreAwards}>
            {__('Add awards')}
        </Button>
        </div>
        </Col>
        </Row>
            </Form>
            <Row>
            <br/><br/>
              <Col sm={6}>
                <Button
                  outlined
                  bsStyle='lightgreen'
                  data-tab-key='photos_videos'
                  onClick={this.props.changeTabKey}>
                  {__('Previous')}
                </Button>{' '}
              </Col>
              <Col sm={6} className='text-right'>
                <Button
                  outlined
                  bsStyle='lightgreen'
                  onClick={::this.save}>
                  {__('Save & Next')}
                </Button>
              </Col>
              <br/>
              <br/>
            </Row>
          </Row>

		    </Col>
<Col xs={12}>
<Row>
<Col xs={12}>
</Col>
</Row>
</Col>
		</Row>

	);
}
}

addMoreAwards() {
this.props.dispatch(
    actions.hospital.addMoreAward(this.props)
  );
}
removeAward(index) {
   this.props.dispatch({
      type: 'REMOVE_AWARD', index });
 }
 updateAwardInputData(name, value, dataIndex) {
    this.props.dispatch({
       type: 'UPDATE_AWARD_INPUT_VALUE', name, value, dataIndex });
      }
save(){
  this.props.dispatch(
    actions.hospital.saveInformation(this.props)
  );
}
getStatusIcon(status) {
switch (status) {
case 0:
        return 'icon-simple-line-icons-check';
        case 1:
        return 'icon-simple-line-icons-close';
        case - 1:
        return 'icon-fontello-spin4';
}
}
async changeStatus(itemId, status) {

await this.props.data.dispatch(
        actions.hospital.changeStatusDocument(
                this.props.data,
                itemId,
                status
                )
        )
this.props.data.dispatch(actions.hospital.edit(this.props.data, this.props.data.hospital.id));

}
updateData(name, value) {
this.props.data.dispatch({
type: 'UPDATE_DATA_VALUE',
        value,
        name
});
}
}
