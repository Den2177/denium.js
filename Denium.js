export class Graph {
    maxValuePaddingY = 15;
    graphBottomAndLeftPadding = 30;

    constructor(parent, data) {
        this.parent = parent;

        this.fullWidth = this.parent.clientWidth;
        this.fullHeight = this.parent.clientHeight;

        this.graphWidth = this.fullWidth - this.graphBottomAndLeftPadding;
        this.graphHeight = this.fullHeight - this.graphBottomAndLeftPadding;

        this.data = this.normalizeData(data);

        this.step = (this.graphWidth) / this.data.length;

        // hide parent for future animation effect
        this.hideParent();
        // set default styles for this graph
        this.setDefaultParentStyles();
    }

    draw() {
        //create main svg element
        this.svg = this.createMainSvg();

        //creating components
        const path = this.createGraphLines();
        const border = this.createBorder();
        const circles = this.createCircles();
        const gradient = this.createGradient();
        const lines = this.createLines();
        const walls = this.createWalls();
        const legend = this.createLegend();

        this.mount(
            lines,
            path,
            gradient,
            border,
            walls,
            legend,
            circles,
        );

        this.startAnimation(path);
    }

    mount(...elements) {
        elements.forEach(element => {
            this.svg.append(element);
        });

        this.parent.append(this.svg);
    }

    hideParent() {
        this.parent.style.opacity = '0';
        this.parent.style.position = 'relative';
        this.parent.style.top = '40px';
    }

    startAnimation(...components) {
        requestAnimationFrame(() => {
            components.forEach(component => {
                if (component.tagName === 'path') {
                    component.setAttribute('style',
                        `stroke-dasharray: ${1000 * this.getPassesInLegendX()};` +
                        ' stroke-dashoffset: 0;' +
                        ' transition: stroke-dashoffset 1s ease;'
                    );

                    return null;
                }
            });

            this.parent.style.position = 'relative';
            this.parent.style.top = '0px';
            this.parent.style.opacity = '1';
            this.parent.style.transition = 'opacity .5s ease, top .5s ease';
        });
    }

    createGraphLines() {
        let path = this.createElement('path');
        const pathString = this.createPathCords();

        path.setAttribute('d', pathString);
        path.setAttribute('stroke-width', '1');
        path.setAttribute('stroke', '#5150F9');
        path.setAttribute('fill', 'url(#purple)');

        //animate path
        path.setAttribute('style', `stroke-dasharray: ${1000 * this.getPassesInLegendX()};` +
            ` stroke-dashoffset: ${1000 * this.getPassesInLegendX()};` +
            ' transition: stroke-dashoffset 1s ease');

        return path;
    }

    createLegend() {
        let g = this.createElement('g');

        let max = Math.max(...this.data.map(item => item.y));
        let min = Math.min(...this.data.map(item => item.y));

        const step = (max - min) / 10;

        for (let i = 0; i < 11; i++, max -= step) {
            const text = this.createSimpleTextNode();
            text.setAttribute(`x`, '0');
            text.setAttribute(`y`, `${max}`);

            const textNode = document.createTextNode(`${i * 10}%`);
            text.appendChild(textNode);
            g.append(text);
        }

        let currentX = this.step;
        this.getPassesInLegendX();

        let isDrawLegend = true;
        const passesConstCounter = this.getPassesInLegendX();
        let passesCounter = passesConstCounter;

        this.data.forEach((item, index, arr) => {
            if (isDrawLegend && index !== arr.length - 1) {
                const text = this.createSimpleTextNode();
                text.setAttribute('x', `${currentX}`);
                text.setAttribute(`y`, `${this.fullHeight - 10}`);
                let textNode = document.createTextNode(`${item.x}`);
                text.append(textNode);
                g.append(text);

                if (passesConstCounter) isDrawLegend = false;
            } else {
                if (--passesCounter === 0) {
                    isDrawLegend = true;
                    passesCounter = passesConstCounter;
                }
            }

            currentX += this.step;
        });

        return g;
    }

    getPassesInLegendX() {
        if (this.data.length < 10) return 0;

        const lengthCount = this.data.length
            .toString()
            .split('')
            .filter((i, index, arr) => !(arr.length - 1 === index))
            .join('');

        return parseInt(lengthCount);
    }

    createSimpleTextNode() {
        const text = this.createElement('text');
        text.setAttribute(`fill`, '#898999');
        text.setAttribute(`stroke`, `#898999`);
        text.setAttribute(`font-weight`, '400');
        text.setAttribute(`font-size`, '9');
        text.setAttribute(`stroke-width`, '.1');
        text.setAttribute(`font-family`, 'DM Sans, sans-serif');

        return text;
    }

    createMainSvg() {
        let svg = this.createElement('svg');
        const width = this.fullWidth;
        const height = this.fullHeight;
        svg.setAttribute('viewbox', `0 0 ${width} ${height}`);
        svg.setAttribute('height', `${height}`);
        svg.setAttribute('width', `${width}`);

        return svg;
    }

    createLines() {
        const g = this.createElement('g');

        let linesString = '';

        const min = Math.min(...this.data.map(item => item.y));
        const max = Math.max(...this.data.map(item => item.y));

        let step = (max - min) / 10;

        let lineY = min;

        for (let i = 0; i < 11; i++) {
            linesString += `<line x1="${this.graphBottomAndLeftPadding}" x2="${this.fullWidth}" y1="${lineY}" y2="${lineY}" stroke="#282932" stroke-width="1"></line>`;
            lineY += step;
        }

        g.insertAdjacentHTML('beforeend', linesString);

        return g;
    }

    createWalls() {
        const wall = this.createElement('path');
        let pathString = `M ${this.graphBottomAndLeftPadding} 0 L ${this.graphBottomAndLeftPadding} ${this.graphHeight} L ${this.fullWidth} ${this.graphHeight}`;

        wall.setAttribute('d', pathString);
        wall.setAttribute('stroke-width', '1');
        wall.setAttribute('stroke', '#4f4f52');
        wall.setAttribute('fill', 'transparent');

        return wall;
    }

    createGradient() {
        const g = this.createElement('g');
        const gradientString = `<linearGradient id="purple"> <stop stop-color="#5150F9" stop-opacity="0.3"/>
            <stop offset="1" stop-color="#5150F9" stop-opacity="0.1"/> </linearGradient>`;
        g.insertAdjacentHTML('beforeend', gradientString);

        return g;
    }

    createBorder() {
        const border = this.createElement('path');
        let borderD = `M 0 ${this.graphHeight} L ${this.fullWidth} ${this.graphHeight} L ${this.fullWidth} 0`;
        border.setAttribute('d', borderD);
        border.setAttribute('stroke-width', '2');
        border.setAttribute('stroke', '#1E1F25');
        border.setAttribute('fill', 'transparent');

        return border;
    }

    createCircles() {
        const g = this.createElement('g');

        let currentX = this.graphBottomAndLeftPadding;

        currentX += this.step;
        this.data.forEach(cord => {
            let circle = this.createElement('circle');
            circle.setAttribute('cx', `${currentX}`);
            circle.setAttribute('cy', `${cord.y}`);
            circle.setAttribute('fill', `#5150F9`);
            circle.setAttribute('r', `3`);
            let title = this.createElement('title');
            let textNode = document.createTextNode(`${cord.x}`);
            title.append(textNode);
            circle.append(title);
            g.append(circle);

            currentX += this.step;
        });

        return g;
    }

    createPathCords() {
        let pathString = '';
        let currentX = this.graphBottomAndLeftPadding;

        pathString += `M ${currentX} ${this.graphHeight} `;
        currentX += this.step;

        this.data.forEach(cord => {
            pathString += `L ${currentX} ${cord.y} `;

            currentX += this.step;

        });

        pathString += `L ${this.fullWidth} ${this.graphHeight} L ${this.graphBottomAndLeftPadding} ${this.graphHeight}`;

        return pathString;
    }

    createElement(svgName) {
        return document.createElementNS("http://www.w3.org/2000/svg", svgName);
    }

    normalizeData(data) {
        // normalize Y difference

        const max = Math.max(...data.map(item => item.y));
        const min = Math.min(...data.map(item => item.y));

        data.forEach(item => {
            item.y = (5 + ((item.y - min) * (95 - this.maxValuePaddingY)) / (max - min)) * (0.01 * this.graphHeight);
        });

        //normalize x date to javascript date format (this is done so that in the future we can work with dates in js.)

        return data.map(item => {
            if (/\./gi.test(item.x)) {
                return {
                    x: item.x.replace(/\./gi, '-').split('-').reverse().join('-'),
                    y: this.graphHeight - item.y,
                }
            }
        });
    }
    setDefaultParentStyles() {
        this.parent.style.borderRadius = '.75rem';
        this.parent.style.backgroundColor = '#1E1F25';
        this.parent.style.padding = '20px';
    }
}
