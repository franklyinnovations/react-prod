import React from 'react';
import ReactDOM from 'react-dom';

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = event => {
            this.props.handleEditorChange(this.props.name, event.target.innerHTML)
        }
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this._el)).trumbowyg({
            autogrow: true,
            dir: $('html').attr('dir'),
            svgPath: false,
            btns: [
                ['viewHTML'],
                ['undo', 'redo'],
                ['formatting'],
                'btnGrp-semantic',
                ['superscript', 'subscript'],
                ['link'],
                ['insertImage'],
                'btnGrp-justify',
                'btnGrp-lists',
                ['horizontalRule'],
                ['removeformat'],
            ]
        })
        .on('tbwchange', this.handleChange)
        .on('tbwfocus', this.handleChange)
        .trumbowyg('html', this.props.value);
    }

    render() {
        return <div id={this.props.name} ref={(el) => this._el = el}></div>;
    }
}
