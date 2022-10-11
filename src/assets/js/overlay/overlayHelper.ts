import { DragElement } from "../dragElement.js";
import { Dictionary, Main, ReturnData } from "../main.js";
import { MapData, LiveData } from "./types/web.js";

export class OverlayHelper
{
    public static OverlayPHP(params:
    {
        method: "getOverlayByID" | "getOverlaysBySearch" | "createOverlay" | "saveOverlay" | "deleteOverlay",
        data?: object
        success?: (response: ReturnData) => any
        error?: (ex: any) => any
        async?: boolean
    })
    {
        return jQuery.ajax(
        {
            async: params.async !== undefined ? params.async : true,
            url: `${Main.WEB_ROOT}/assets/php/overlay.php`,
            method: "POST",
            dataType: "json",
            data:
            {
                "q": JSON.stringify(
                {
                    method: params.method,
                    data: params.data !== undefined ? params.data : {}
                })
            },
            error: params.error !== undefined ? params.error : Main.ThrowAJAXJsonError,
            success: params.success
        });
    }
}

export interface IOverlayData
{
    id: string,
    uid: string,
    name: string,
    description: string | null,
    elements: string | null,
    thumbnail: string | null,
    isPrivate: '0' | '1',
    dateAltered: number,
    username: string
}

export type TEditableStyles =
{
    foregroundColour?: true,
    backgroundColour?: true,
    altColour?: true,
    fontSize?: true;
    horizontalAlign?:
    {
        left?: true,
        right?: true,
        center?: true
    },
    verticalAlign?:
    {
        left?: true,
        right?: true,
        center?: true
    },
    align?:
    {
        left?: true,
        right?: true,
        center?: true
    },
    content?: true
}

export type TCustomStyles =
{
    foregroundColour?: IRGB,
    backgroundColour?: IRGB,
    altColour?: IRGB,
    fontSize?: number,
    horizontalAlign?: "left" | "right" | "center",
    verticalAlign?: "top" | "bottom" | "center",
    align?: "topLeft" | "bottomRight" | "center",
    content?: string
}

//RGBA, 'A' will probably not be used but it would be easy to add if it is needed in the future.
export interface IRGB
{
    R: number,
    G: number,
    B: number
}

export type ElementsJSON =
{
    [category: string]:
    {
        [type: string]:
        {
            [id: string]:
            {
                showInEditor: boolean,
                html: string,
                css: string,
                script: ElementScript
            }
        }
    }
}

export type SavedElements =
{
    [category: string]:
    {
        [type: string]:
        {
            [id: string]:
            {
                zIndex: number,
                position:
                {
                    top?: string,
                    left?: string,
                    bottom?: string,
                    right?: string,
                }
                width: string | undefined,
                height: string | undefined,
                customStyles: TCustomStyles
            }[];
        }
    }
}

export type CreatedElements =
{
    idCount: number,
    zIndex: number,
    locations: Dictionary<[string, string, string, string]>, //This just makes it easier for me to navigate this object.
    elements:
    {
        [category: string]:
        {
            [type: string]:
            {
                [id: string]:
                {
                    script: ElementScript,
                    elements:
                    {
                        [elementID: string]:
                        {
                            zIndex: number,
                            position:
                            {
                                //These are left as a string for % values
                                top?: string,
                                left?: string,
                                bottom?: string,
                                right?: string,
                            }
                            width: string | undefined,
                            height: string | undefined,
                            customStyles: TCustomStyles,
                            mutationObserver?: MutationObserver,
                            dragElement?: DragElement
                        }
                    }
                }
            }
        }
    }
}

export interface ElementScript
{
    readonly initialWidth: number | undefined;
    readonly initialHeight: number | undefined;
    readonly resizeMode: 0 | 1 | 2 | 3, //0 = No resize, 1 = Both, 2 = Width, 3 = Height
    readonly editableStyles: TEditableStyles;
    new(): ElementScript;
    AddElement(element: HTMLDivElement): void;
    UpdateStyles(element: HTMLDivElement, styles: TCustomStyles): void;
    RemoveElement(element: HTMLDivElement): void;
    ResetData(): void;
    UpdateMapData(data: MapData): void;
    UpdateLiveData(data: LiveData): void;
}
