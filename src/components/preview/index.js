import React from "react";
import './index.css';
class Preview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            preWidth: 180,
            width: 0,
            height: 0,
            scale: 1,
        }
    }

    componentDidMount() {
        window.stage.svg.id = 'preview-svg';
        const { width, height } = window.stage.board.getBoundingClientRect();

        const scale = width / this.state.preWidth;

        this.setState({
            width,
            height,
            scale
        });
    }

    render() {
        return (
            <div className="preview">
                <svg width={`${this.state.preWidth}`} height={`${this.state.height / this.state.scale}`} >
                    <use href="#preview-svg" transform={`scale(${this.state.preWidth / this.state.width} ${(this.state.height / this.state.scale) / this.state.height})`} />
                </svg>
            </div>
        );
    }
}

export default Preview