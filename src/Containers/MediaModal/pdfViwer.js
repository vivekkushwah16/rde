import React, { Component } from 'react';
import ViewSDKClient from '../../Utility/ViewSDKClient';

class PDFViwer extends Component {
    componentDidMount() {
        const viewSDKClient = new ViewSDKClient();
        viewSDKClient.ready().then(() => {
            viewSDKClient.previewFile("pdf-div", {
                embedMode: "SIZED_CONTAINER"
            }, this.props.link, this.props.name);
        });
    }

    render() {
        return <div id="pdf-div" className="sized-container-div" />;
    }
}

export default PDFViwer;
