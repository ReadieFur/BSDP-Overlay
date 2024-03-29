import { Main } from "./main.js";

export class DragElement
{
    private container: HTMLElement;
    private containerScale: number;
    private element: HTMLElement;
    private mouseX: number;
    private mouseY: number;
    private xChange: number;
    private yChange: number;

    constructor(_element: HTMLDivElement, _container?: HTMLElement)
    {
        if (_container !== undefined) { this.container = _container; }
        else { this.container = document.body; }
        this.containerScale = 1;
        this.element = _element;
        this.mouseX = 0;
        this.mouseY = 0;
        this.xChange = 0;
        this.yChange = 0;

        this.GetScale();
        new MutationObserver(() => { this.GetScale(); }).observe(this.container, { attributes: true });

        //Event listeners were being a problem here so for now I will be setting only one event to the container (this will stop me from being able to use this event on this element elsewhere).
        this.element.onmousedown = (e: MouseEvent) => { this.MouseDownEvent(e); };
    }

    private GetScale(): void
    {
        var scale = parseFloat(Main.GetElementTransforms(this.container)["scale"]);

        if (scale !== undefined && !isNaN(scale))
        {
            this.containerScale = scale;
        }
    }

    private MouseDownEvent(e: MouseEvent): void
    {
        //When this was inside the if statment below the element would resizse from the side it was offset from which was good but it was very hard to control.
        this.element.style.left = `${this.element.offsetLeft}px`;
        this.element.style.top = `${this.element.offsetTop}px`;
        this.element.style.right = "unset";
        this.element.style.bottom = "unset";
        this.container.onmouseup = (_e: MouseEvent) => { this.MouseUpEvent(_e); };

        //If the mouse is not over the resize grabber, move the element.
        if (!(e.offsetX > this.element.clientWidth - 15 && e.offsetY > this.element.clientHeight - 15))
        {
            e.preventDefault();
            //Remove the elements right/bottom position and replace it back to left/top.
            //Set mouse position when the mouse is first down.
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            //If using element instead of the container, if the mouse moves fast enough to escape the element before its position is updated, it will stop updating the elements position until the mouse goes over the element again.
            this.container.onmousemove = (_e: MouseEvent) => { this.MouseMoveEvent(_e); };
        }
    }
    
    private MouseMoveEvent(e: MouseEvent): void
    {
        e.preventDefault();
        //Calculate the change in mouse position.
        //The scale application isn't perfect but it will do.
        this.xChange = (this.mouseX - e.clientX) / this.containerScale;
        this.yChange = (this.mouseY - e.clientY) / this.containerScale;
        //Set the new position of the mouse.
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        //Move the element to the new position.
        var elementLeft: number;
        if (this.element.offsetLeft + this.element.clientWidth > this.container.clientWidth)
        { elementLeft = this.container.clientWidth - this.element.clientWidth }
        else if (this.element.offsetLeft < 0)
        { elementLeft = 0; }
        else { elementLeft = this.element.offsetLeft - this.xChange; }
        this.element.style.left = `${elementLeft}px`;

        var elementTop: number;
        if (this.element.offsetTop + this.element.clientHeight > this.container.clientHeight)
        { elementTop = this.container.clientHeight - this.element.clientHeight }
        else if (this.element.offsetTop < 0)
        { elementTop = 0; }
        else
        { elementTop = this.element.offsetTop - this.yChange; }
        this.element.style.top = `${elementTop}px`;
    }
    
    private MouseUpEvent(e: MouseEvent): void
    {
        //Stop moving when the mouse is released.
        this.container.onmouseup = null;
        this.container.onmousemove = null;

        //Set the elements position with left/right/top/bottom, work % values into this.
        if (this.element.offsetLeft + this.element.clientWidth / 2 > this.container.clientWidth / 2)
        {
            this.element.style.right = `${this.container.clientWidth - this.element.offsetLeft - this.element.clientWidth}px`;
            this.element.style.left = "unset";
        }

        if (this.element.offsetTop + this.element.clientHeight / 2 > this.container.clientHeight / 2)
        {
            this.element.style.bottom = `${this.container.clientHeight - this.element.offsetTop - this.element.clientHeight}px`;
            this.element.style.top = "unset";
        }
    }
}