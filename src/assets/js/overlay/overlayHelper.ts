import { Main, ReturnData } from "../main";
import { SavedElements } from "./ui";

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
            async: params.async??true,
            url: `${Main.WEB_ROOT}/assets/php/overlay.php`,
            method: "POST",
            dataType: "json",
            data:
            {
                "q": JSON.stringify(
                {
                    method: params.method,
                    data: params.data??{}
                })
            },
            error: params.error??Main.ThrowAJAXJsonError,
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
    elements: string,
    thumbnail: string | null,
    isPrivate: '0' | '1',
    dateAltered: number,
    username: string
}

export type TEditableStyles =
{
    foregroundColour?: true,
    backgroundColour?: true,
    accentColour?: true,
    fontSize?: true;
}

export type TCustomStyles =
{
    foregroundColour?: IRGB,
    backgroundColour?: IRGB,
    accentColour?: IRGB,
    fontSize?: number
}

//RGBA, 'A' will probably not be used but it would be easy to add if it is needed in the future.
export interface IRGB
{
    R: number,
    G: number,
    B: number
}