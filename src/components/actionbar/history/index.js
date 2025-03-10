import React from "react";
import "./index.css";
class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            position: void 0,
            canUndo: false,
            canRedo: false,
        };
        this.event = void 0;
    }

    undo() {
        const stage = window.stage;
        stage.undoManager.undo();
    }

    redo() {
        const stage = window.stage;
        stage.undoManager.redo();
    }

    clear() {
        const stage = window.stage;
        stage.undoManager.clear();
    }

    init() {
        const stage = window.stage;
        this.setState({
            groups: stage.undoManager.groups,
            position: stage.undoManager.position,
            canUndo: stage.undoManager.canUndo(),
            canRedo: stage.undoManager.canRedo(),
        });
    }

    componentDidMount() {
        this.init();
        const stage = window.stage;
        this.setState({
            groups: stage.undoManager.groups,
            position: stage.undoManager.position,
        });

        window.stage.board.addEventListener(
            "undochange",
            (this.event = () => {
                this.init();
            })
        );
    }

    componentWillUnmount() {
        window.stage.board.removeEventListener("undochange", this.event);
    }

    skip(index) {
        const stage = window.stage;
        const position = stage.undoManager.position - 1;

        if (index < position) {
            for (let i = 0; i < position - index; i++) {
                stage.undoManager.undo();
            }
        } else {
            for (let i = 0; i < index - position; i++) {
                stage.undoManager.redo();
            }
        }
        stage.selectedElements.clear();
    }

    render() {
        return (
            <div className="history">
                <div className={`operate `}>
                    <div className={`undo ${!this.state.canUndo && 'disabled'} `} onClick={() => {
                        this.undo();
                    }}>
                        <svg
                            preserveAspectRatio="none"
                            viewBox="0 0 100 100"
                            width="16"
                            height="16"
                        >
                            <path d="M 51.294 32.925 C 38.367 32.925 26.658 37.756 17.633 45.609 L 0.07 28.046 L 0.07 71.953 L 43.976 71.953 L 26.268 54.292 C 47.331 36.369 79.849 45.624 88.321 71.953 L 99.93 68.147 C 93.009 47.147 73.405 32.949 51.294 32.925 Z"></path>
                        </svg>
                    </div>
                    <div className={`redo ${!this.state.canRedo && 'disabled'} `} onClick={() => {
                        this.redo();
                    }}>
                        <svg preserveAspectRatio="none" viewBox="0 0 100 100" width="16" height="16">
                            <path d="M 51.294 67.074 C 38.367 67.074 26.658 62.243 17.633 54.39 L 0.07 71.953 L 0.07 28.046 L 43.976 28.046 L 26.268 45.707 C 47.331 63.63 79.849 54.375 88.321 28.046 L 99.93 31.852 C 93.009 52.852 73.405 67.05 51.294 67.074 Z" transform="matrix(-1, 0, 0, -1, 100.000001, 99.999004)"></path>
                        </svg>
                    </div>
                    <div className="clear" onClick={() => {
                        this.clear();
                    }}>
                        <svg preserveAspectRatio="none" viewBox="0 0 100 100" width="16" height="16">
                            <path d="M 15.776 31.778 L 22.156 95.687 C 22.156 97.964 24.068 99.801 26.416 99.801 L 73.601 99.801 C 75.95 99.801 77.86 97.964 77.86 95.687 L 84.241 31.778 L 15.776 31.778 L 15.776 31.778 Z M 53.445 87.775 L 46.771 87.775 L 46.771 43.707 L 53.445 43.707 L 53.445 87.775 L 53.445 87.775 Z M 65.895 87.775 L 59.223 87.775 L 65.446 43.707 L 72.121 43.707 L 65.895 87.775 L 65.895 87.775 Z M 40.995 87.775 L 34.32 87.775 L 28.096 43.707 L 34.77 43.707 L 40.995 87.775 L 40.995 87.775 Z"></path>
                            <path d="M 84.834 13.303 L 65.296 13.303 L 65.296 4.612 C 65.296 2.172 62.46 0.199 59.968 0.199 L 40.702 0.199 C 38.212 0.199 34.757 1.598 34.757 4.026 L 34.757 12.717 L 15.179 13.303 C 12.684 13.303 10.653 15.268 10.653 17.709 L 10.653 24.9 L 89.346 24.9 L 89.346 17.709 C 89.353 15.276 87.335 13.303 84.834 13.303 L 84.834 13.303 Z M 40.46 9.162 C 40.46 7.22 42.644 5.646 45.333 5.646 L 55.07 5.646 C 57.759 5.646 59.939 7.226 59.939 9.162 L 59.939 13.303 L 40.453 13.303 L 40.453 9.162 L 40.46 9.162 Z" ></path>
                        </svg>
                    </div>
                </div>
                {
                    this.state.groups.map((item, index) => (
                        <div
                            style={{ opacity: this.state.position - 1 < index ? 0.4 : 1 }}
                            key={index}
                            onClick={() => {
                                this.skip(index);
                            }}
                            className={`history-item ${this.state.position - 1 === index && "active"
                                }`}
                        >
                            <div
                                className="icon"
                                dangerouslySetInnerHTML={{
                                    __html: this.icon(item.label.replace("#", "")),
                                }}
                            ></div>
                            <div className="label">{item.label.replace("#", "")}</div>
                        </div>
                    ))
                }
            </div >
        );
    }

    icon(type) {
        switch (type) {
            case "move":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6L43 25L24 27L13.9948 44L8 6Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`;
            case "scale":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 4H4V44H44V4Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M16 4V16H4" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 24V36H24" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 36L24 24" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 6V26" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 4H27" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "rectangle":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z" fill="none" stroke="currentColor" stroke-width="4"/></svg>`;
            case "ellipseangle":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="24" rx="14" ry="20" fill="none" stroke="currentColor" stroke-width="4"/></svg>`;
            case "triangle":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.2692 6.98965C23.0395 5.65908 24.9605 5.65908 25.7309 6.98965L44.262 38.9979C45.0339 40.3313 44.0718 42 42.5311 42H5.4689C3.92823 42 2.96611 40.3313 3.73804 38.9979L22.2692 6.98965Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "star":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`;
            case "path-tool":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="10" r="4" fill="currentColor" stroke="currentColor" stroke-width="1"/><path d="M28 38H13.0004C9.00037 38 6.00037 35.0833 6 31C5.99963 26.9167 9.00037 24 13.0004 24H20" stroke="currentColor" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M20.0003 24H34.9997C38.9997 24 41.9996 21.0833 42 17C42.0004 12.9167 38.9997 10 34.9997 10H20" stroke="currentColor" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M6 10L12 10" stroke="currentColor" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M36 38H42" stroke="currentColor" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"/><circle cx="32" cy="38" r="4" fill="currentColor" stroke="currentColor" stroke-width="1"/></svg>`;
            case "text":
            case "edit-text":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="36" height="36" rx="3" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M16 19V16H32V19" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 34H26" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 18L24 34" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "guide":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 14L34 4L30.25 7.75L26.5 11.5L19 19L11.5 26.5L7.75 30.25L4 34L14 44L44 14Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.25 7.75L7.75 30.25" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 29L13 33" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 24L20 30" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 19L23 23" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 14L30 20" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 9L33 13" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "resize":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 12C42.2091 12 44 10.2091 44 8C44 5.79086 42.2091 4 40 4C37.7909 4 36 5.79086 36 8C36 10.2091 37.7909 12 40 12Z" fill="none" stroke="currentcOLOR" stroke-width="4" stroke-linejoin="round"/><path d="M8 44C10.2091 44 12 42.2091 12 40C12 37.7909 10.2091 36 8 36C5.79086 36 4 37.7909 4 40C4 42.2091 5.79086 44 8 44Z" fill="none" stroke="currentcOLOR" stroke-width="4" stroke-linejoin="round"/><path d="M40 20V40H20" stroke="currentcOLOR" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 28V8H28" stroke="currentcOLOR" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "cut":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M11 42C13.7614 42 16 39.7614 16 37C16 34.2386 13.7614 32 11 32C8.23858 32 6 34.2386 6 37C6 39.7614 8.23858 42 11 42Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M37 42C39.7614 42 42 39.7614 42 37C42 34.2386 39.7614 32 37 32C34.2386 32 32 34.2386 32 37C32 39.7614 34.2386 42 37 42Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M15.3774 39.4131L17.5 35.8162L34.5 6.37138" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M13.4957 6.17518L30.4957 35.62L32.6265 39.4131" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`;
            case "copy":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`;
            case "paste":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 7H16H10C8.89543 7 8 7.89543 8 9L8 42C8 43.1046 8.89543 44 10 44H38C39.1046 44 40 43.1046 40 42V9C40 7.89543 39.1046 7 38 7H33.0499H31" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="17" y="4" width="14" height="6" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`;
            case "freehand":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#icon-8d8a6e552696ccc)"><path d="M30.9995 8.99902L38.9995 16.999" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.99953 31.999L35.9994 4L43.9995 11.999L15.9995 39.999L5.99951 41.999L7.99953 31.999Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.9995 8.99902L38.9995 16.999" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.99951 31.999L15.9995 38.999" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.9995 34.999L34.9995 12.999" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="icon-8d8a6e552696ccc"><rect width="48" height="48" fill="currentColor"/></clipPath></defs></svg>`;
            case "cubic-bezier":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 35C40 25.7953 32.8366 10 24 10C15.1634 10 8 25.7953 8 35" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="35" width="8" height="8" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><rect x="4" y="6" width="8" height="8" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><rect x="36" y="35" width="8" height="8" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><rect x="36" y="6" width="8" height="8" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M12 10H36" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "group":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4H4V12H12V4Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M44 36H36V44H44V36Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M12 36H4V44H12V36Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M44 4H36V12H44V4Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M8 36V12" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 36V12" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8H36" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 40H36" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16 16H25.6V22.4H32V32H22.4V25.6H16V16Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "ungroup":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2727 4H4V11.2727H11.2727V4Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M43.9998 36.7271H36.7271V43.9998H43.9998V36.7271Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M11.2727 24H4V31.2727H11.2727V24Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M23.9998 36.7271H16.7271V43.9998H23.9998V36.7271Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M31.2727 4H24V11.2727H31.2727V4Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M43.9998 16.7271H36.7271V23.9998H43.9998V16.7271Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M11.2729 7.63623H24.0002" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 40.3638H36.7273" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.2729 27.6366H27.6366V11.2729" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28.8275 20.3633H36.7269M20.3633 36.7269V27.6282V36.7269Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.63672 11.2725V23.9997" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M40.3633 24V36.7273" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "raise":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 21V34H27" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 14H34V27" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 21V5H21V21H5Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 43V27H43V43H27Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "raise-to-front":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 41V21C5 19.8954 5.89543 19 7 19H19H27C28.1046 19 29 19.8954 29 21V29V41C29 42.1046 28.1046 43 27 43H7C5.89543 43 5 42.1046 5 41Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M43 7V27C43 28.1046 42.1046 29 41 29H31C29.8954 29 29 28.1046 29 27V21C29 19.8954 28.1046 19 27 19H21C19.8954 19 19 18.1046 19 17V7C19 5.89543 19.8954 5 21 5H41C42.1046 5 43 5.89543 43 7Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "lower":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 21H5V5H21V14" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M32 27H43V43H27V32" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 32V14H32V32H14Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`;
            case "lower-to-back":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 41V21C5 19.8954 5.89543 19 7 19H17C18.1046 19 19 19.8954 19 21V27C19 28.1046 19.8954 29 21 29H27C28.1046 29 29 29.8954 29 31V41C29 42.1046 28.1046 43 27 43H7C5.89543 43 5 42.1046 5 41Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 27V7C19 5.89543 19.8954 5 21 5H41C42.1046 5 43 5.89543 43 7V27C43 28.1046 42.1046 29 41 29H21C19.8954 29 19 28.1046 19 27Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            case "delete":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 10V44H39V10H9Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M20 20V33" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 20V33" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 10H44" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10L19.289 4H28.7771L32 10H16Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`;
            case "style":
                return `<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 40.9444C26.123 42.8446 28.9266 44 32 44C38.6274 44 44 38.6274 44 32C44 26.4085 40.1757 21.7102 35 20.3781" stroke="#000000" stroke-width="1" stroke-linejoin="miter"/><path d="M13 20.3781C7.82432 21.7102 4 26.4085 4 32C4 38.6274 9.37258 44 16 44C22.6274 44 28 38.6274 28 32C28 30.4506 27.7063 28.9697 27.1716 27.6101" stroke="#000000" stroke-width="1" stroke-linejoin="miter"/><path d="M24 28C30.6274 28 36 22.6274 36 16C36 9.37258 30.6274 4 24 4C17.3726 4 12 9.37258 12 16C12 22.6274 17.3726 28 24 28Z" fill="#000000" stroke="#000000" stroke-width="1" stroke-linejoin="miter"/></svg>`;
            default:
        }
    }
}

export default History;
