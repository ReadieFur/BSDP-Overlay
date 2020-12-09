<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/../api/account/DBDetails.php';

$query = json_decode($_GET["q"], true);
$resultsPerPage = 15;
$response = new stdClass();
$response->query = $query;
$nameSort = null;

if (isset($query["page"])) //Query has page count ? get query type : return null
{
    $startIndex = $resultsPerPage * $query["page"] - $resultsPerPage;
    $endIndex = $startIndex + $resultsPerPage;
    //Most queries will be have the same structure aside from the where
    $sqlBefore = "SELECT overlays.id, overlays.unid, overlays.oname, usr.username, overlays.b64
    FROM users usr
    LEFT JOIN bsdp_overlays overlays
    ON overlays.unid = usr.unid
    WHERE overlays.public = 1 ";
    $sqlAfter = " ORDER BY overlays.alteredDate
    DESC LIMIT $startIndex, $endIndex";

    //Get searches to sort by relevance then date
    if (isset($query["oname"])) //Query type oname
    {
        $nameSort = $query["oname"];
        //$oname = $query["oname"];
        $sql = $sqlBefore . "AND overlays.oname LIKE '%$nameSort%'" . $sqlAfter;
        $csql = "FROM bsdp_overlays WHERE public = 1 AND oname LIKE '%$nameSort%'";
    }
    else if (isset($query["username"])) //Query type username
    {
        $nameSort = $query["username"];
        //$username = $query["username"];
        $sql = $sqlBefore . "AND usr.username LIKE '%$nameSort%'" . $sqlAfter;
        $csql = "FROM users usr LEFT JOIN bsdp_overlays overlays ON overlays.unid = usr.unid WHERE overlays.public = 1 AND usr.username LIKE '%$nameSort%'";
    }
    else if (isset($query["all"]))
    {
        $queryAll = $query["all"];
        $sql = $sqlBefore . "AND overlays.oname LIKE '%$queryAll%' OR usr.username LIKE '%$queryAll%'" . $sqlAfter;
        $csql = "FROM users usr LEFT JOIN bsdp_overlays overlays ON overlays.unid = usr.unid WHERE overlays.public = 1 AND overlays.oname LIKE '%$queryAll%' OR usr.username LIKE '%$queryAll%'";
    }
    else //Query type undefined (return all results for the page)
    {
        $sql = $sqlBefore . $sqlAfter;
        $csql = "FROM bsdp_overlays WHERE public = 1";
    }

    $result = mysqli_query($conn, $sql);
    $response->showingResults = $startIndex . "-" . ($startIndex + mysqli_num_rows($result));
    $response->totalResults = countEntries($csql);
    if (mysqli_num_rows($result) > 0)
    {
        $i = 0;
        $sqlResults;
        while($row = mysqli_fetch_assoc($result))
        {
            $cellData = new stdClass();
            $cellData->id = $row["id"];
            $cellData->oname = $row["oname"];
            $cellData->username = $row["username"];
            $cellData->unid = $row["unid"];
            $b64 = explode(",", $row["b64"]);
            $b64Parsed = [];
            for($i = 0; $i < count($b64); $i++) { $b64Parsed[$i] = intval($b64[$i]); }
            $cellData->b64 = $b64Parsed;

            if ($nameSort != null)
            {
                similar_text($nameSort, $row["oname"], $similarity); //Fix for usernames, currently only sorts by username regargless
                $similarity = strval($similarity);
                if (isset($sqlResults[$similarity])) { $similarity -= ($i++); }
                $sqlResults[$similarity] = $cellData;
            }
            else { $sqlResults[] = $cellData; }
        }

        if ($nameSort != null)
        {
            krsort($sqlResults);
            $similarityRemoved;
            foreach($sqlResults as $result) { $similarityRemoved[] = $result; }
            $sqlResults = $similarityRemoved;
            $response->sortedBy = "similarity";
        }
        else { $response->sortedBy = "dateModified"; }

        $response->results = $sqlResults;
    }
    else { $response->results = null; }
}
else if (isset($query["id"]))
{
    $qID = $query["id"];
    $sql = "SELECT overlays.id, overlays.unid, overlays.oname, usr.username, overlays.comment, overlays.b64
    FROM users usr
    LEFT JOIN bsdp_overlays overlays
    ON overlays.unid = usr.unid
    WHERE overlays.public = 1 AND overlays.id = '$qID'";

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0)
    {
        $sqlResults;
        $row = mysqli_fetch_assoc($result);
        $sqlResults->id = $row["id"];
        $sqlResults->unid = $row["unid"];
        $sqlResults->oname = $row["oname"];
        $sqlResults->username = $row["username"];
        $sqlResults->comment = $row["comment"];
        $b64 = explode(",", $row["b64"]);
        $b64Parsed = [];
        for($i = 0; $i < count($b64); $i++) { $b64Parsed[$i] = intval($b64[$i]); }
        $sqlResults->b64 = $b64Parsed;
        $response->result = $sqlResults;
    }
    else { $response->result = null; }
}
else { $response->results = null; }

echo json_encode($response);

function countEntries(&$sql)
{
    global $conn;
    $sql = "SELECT COUNT(*) " . $sql;
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) { return array_values(mysqli_fetch_assoc($result))[0]; }
    else { return null; }
}