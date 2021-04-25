import { Main, ReturnData } from "../main";

export class OverlayHelper
{
    public static OverlayPHP(params:
    {
        method: "getOverlayByID" | "getOverlaysBySearch",
        data: object
        success: (response: ReturnData) => any
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
                    data: params.data
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
    elements: object,
    thumbnail: string | null,
    isPrivate: '0' | '1',
    alteredDate: number,
    username: string
}