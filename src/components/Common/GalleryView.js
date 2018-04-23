import React from 'react';
import {text_truncate} from '../../utils';

import {
  Row,
  Col,
  Icon,
  Grid,
  Panel,
  Image,
  Table,
  Button,
  PanelBody,
  PanelHeader,
  PanelContainer,
} from '@sketchpixy/rubix';

export default class GalleryView extends React.Component {
    render() {
        return (
            <PanelContainer controls={false}>
                <Panel style={{background: '#E9F0F5'}}>
                    <PanelHeader>
                        <Grid className='gallery-item'>
                            <Row>
                                <Col xs={12} style={{padding: 12.5}}>
                                    <a className='gallery-1 gallery-item-link' href={this.props.image} title={this.props.title}>
                                        <Image responsive src={this.props.image} alt={this.props.title} width='200' height='150' style={{height: '150px', width: '200px'}}/>
                                        <div className='black-wrapper text-center'>
                                            <Table style={{height: '100%', width: '100%'}}>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <Icon glyph='icon-outlined-magnifier-plus icon-3x' style={{color: 'white', display: 'block'}}/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </a>
                                    <div className='text-center'>
                                        <h4 className='fg-darkgrayishblue75 hidden-xs' style={{textTransform: 'uppercase'}}>{text_truncate(this.props.title, 16)}</h4>
                                        <h6 className='fg-darkgrayishblue75 visible-xs' style={{textTransform: 'uppercase'}}>{this.props.title}</h6>
                                        <h5 className='fg-darkgray50 hidden-xs' style={{textTransform: 'uppercase'}}>{this.props.subtitle}</h5>
                                        <h6 className='visible-xs' style={{textTransform: 'uppercase'}}><small className='fg-darkgray50'>{this.props.subtitle}</small></h6>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </PanelHeader>
                </Panel>
            </PanelContainer>
        );
    }
}
