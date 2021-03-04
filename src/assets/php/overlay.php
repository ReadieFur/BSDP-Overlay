<?php
include_once $_SERVER['DOCUMENT_ROOT'].'/../api/account/DBDetails.php';
include_once $_SERVER['DOCUMENT_ROOT'].'/../api/account/accountFunctions.php';

global $pdoConn;
global $conn; //TMP

$response = new stdClass();
$response->error = null;
$response->data = new stdClass();

if (isset($_POST['q']))
{
    $query = json_decode($_POST['q'], true);

    if (isset($query['method']))
    {
        switch ($query['method'])
        {
            case 'Create':
                Create($query['data']);
                break;
            case 'Save':
                Save($query['data']);
                break;
            case 'LoadIntoEditor':
                LoadIntoEditor($query['data']);
                break;
            case 'GetByID':
                GetByID($query['data']);
                break;
            /*case 'List':
                _List($query['data']);
                break;*/
            default:
                $response->error = 'INVALID_METHOD';
                break;
        }
    }
    else { $response->error = 'NO_METHOD_FOUND'; }
}
else { $response->error = 'NO_QUERY_FOUND'; }

echo json_encode($response); //This is where the response is sent back to the client.

function _LogIn($data): bool
{
    if (isset($data['unid']) && isset($data['pass']))
    {
        //This function does exist, intellisense just can't find it at the path specified above.
        return LogIn($data['unid'], $data['pass']);
    }
    else { return false; }
}

//Methods.
//Lots of these checks are made on the client side but for extra saftey I will run the checks again on the server side.
function Create($data): void
{
    global $pdoConn;
    global $response;
    
    if (_LogIn($data))
    {
        $sql = $pdoConn->prepare('SELECT COUNT(id) FROM bsdp_overlay WHERE unid = :unid');
        $sql->bindParam(':unid', $data['unid'], PDO::PARAM_STR);
        $sql->execute();

        if ($sql->rowCount() > 0)
        {
            $row = $sql->fetch();
            if (intval($row["COUNT(id)"]) < 10)
            {
                $id = '';
                $sql = $pdoConn->prepare('SELECT id FROM bsdp_overlay WHERE id = :id');
                $sql->bindParam(':id', $id, PDO::PARAM_STR);
                do
                {
                    $id = uniqid();
                    $sql->execute();
                }
                while ($sql->rowCount() > 0);

                $sql = $pdoConn->prepare('INSERT INTO bsdp_overlay(id, unid) VALUES(:id, :unid)');
                $sql->bindParam(':id', $id, PDO::PARAM_STR);
                $sql->bindParam(':unid', $data['unid'], PDO::PARAM_STR);
                $response->data->success = $sql->execute();
                $response->data->id = $id;
            }
            else { $response->error = 'QUOTA_EXCEEDED'; }
        }
        else { $response->error = 'INVALID_SQL_RESPONSE'; }
    }
    else { $response->error = 'INVALID_CREDENTIALS'; }
}

//I was having problems with multiple type declerations here
function Save($data): void
{
    global $pdoConn;
    global $response;
    
    if (_LogIn($data))
    {
        if (
            isset($data['id']) &&
            isset($data['title']) &&
            isset($data['description']) &&
            isset($data['isPrivate']) &&
            isset($data['thumbnail']) &&
            isset($data['elements'])
        )
        {
            if (
                strlen($data['id']) == 13 &&
                (strlen($data['title']) >= 5 && strlen($data['title']) <= 25) &&
                gettype($data['description']) == 'string' &&
                ($data['isPrivate'] == 1 || $data['isPrivate'] == 0) &&
                gettype($data['thumbnail']) == 'string' &&
                count($data['elements']) != 0
            )
            {
                $sql = $pdoConn->prepare('UPDATE bsdp_overlay
                SET name = :name,
                description = :description,
                elements = :elements,
                thumbnail = :thumbnail,
                isPrivate = :isPrivate,
                alteredDate = current_timestamp()
                WHERE id = :id');
                $sql->bindParam(':id', $data['id'], PDO::PARAM_STR);
                $sql->bindParam(':name', $data['title'], PDO::PARAM_STR);
                $sql->bindParam(':description', $data['description'], PDO::PARAM_STR);
                $sql->bindParam(':isPrivate', $data['isPrivate'], PDO::PARAM_INT);
                $sql->bindParam(':thumbnail', $data['thumbnail'], PDO::PARAM_STR);
                $sql->bindValue(':elements', json_encode($data['elements']), PDO::PARAM_STR);
                $response->data->success = $sql->execute();
            }
            else { $response->error = 'INVALID_DATA'; }
        }
        else { $response->error = 'MISSING_PARAMETERS'; }
    }
    else { $response->error = 'INVALID_CREDENTIALS'; }
}

function Delete($data): void
{
    global $pdoConn;
    global $response;

    if (_LogIn($data))
    {
        if (isset($data['id']))
        {
            $sql = $pdoConn->prepare('DELETE FROM bsdp_overlay WHERE id = :id');
            $sql->bindParam(':id', $data['id'], PDO::PARAM_STR);
            $response->data->success = $sql->execute();
        }
        else { $response->error = 'MISSING_PARAMETERS'; }
    }
    else { $response->error = 'INVALID_CREDENTIALS'; }
}

//Work on this one and the function below (in terms of security).
function LoadIntoEditor($data): void
{
    global $pdoConn;
    global $response;

    if (_LogIn($data))
    {
        if (isset($data['id']))
        {
            $sql = $pdoConn->prepare('SELECT
            overlay.unid,
            overlay.name,
            users.username,
            overlay.description,
            overlay.elements,
            overlay.thumbnail,
            overlay.isPrivate,
            overlay.alteredDate
            FROM users users
            LEFT JOIN bsdp_overlay overlay
            ON overlay.unid = users.unid
            WHERE overlay.id = :id');
            $sql->bindParam(':id', $data['id'], PDO::PARAM_STR);
            $sql->execute();
    
            if ($sql->rowCount() > 0)
            {
                $row = $sql->fetch();

                if ($data['unid'] === $row['unid'])
                {
                    $response->data->id = $data['id'];
                    $response->data->unid = $row['unid'];
                    $response->data->name = $row['name'];
                    $response->data->username = $row['username'];
                    $response->data->description = $row['description'];
                    $response->data->elements = json_decode($row['elements']);
                    $response->data->thumbnail = $row['thumbnail'];
                    $response->data->isPrivate = $row['isPrivate'];
                    $response->data->alteredDate = $row['alteredDate'];
                }
                else { $response->error = 'INVALID_PERMISSIONS'; }
            }
            else { $response->error = 'INVALID_SQL_RESPONSE'; }
        }
        else { $response->error = 'MISSING_PARAMETERS'; }
    }
    else { $response->error = 'INVALID_CREDENTIALS'; }
}

function GetByID($data): void
{
    global $pdoConn;
    global $response;

    if (isset($data['id']))
    {
        $sql = $pdoConn->prepare('SELECT
        overlay.unid,
        overlay.name,
        users.username,
        overlay.description,
        overlay.elements,
        overlay.thumbnail,
        overlay.isPrivate,
        overlay.alteredDate
        FROM users users
        LEFT JOIN bsdp_overlay overlay
        ON overlay.unid = users.unid
        WHERE overlay.id = :id');
        $sql->bindParam(':id', $data['id'], PDO::PARAM_STR);
        $sql->execute();

        if ($sql->rowCount() > 0)
        {
            $row = $sql->fetch();
            $response->data->id = $data['id'];
            $response->data->unid = $row['unid'];
            $response->data->name = $row['name'];
            $response->data->username = $row['username'];
            $response->data->description = $row['description'];
            $response->data->elements = json_decode($row['elements']);
            $response->data->thumbnail = $row['thumbnail'];
            $response->data->isPrivate = $row['isPrivate'];
            $response->data->alteredDate = $row['alteredDate'];
        }
        else { $response->error = 'INVALID_SQL_RESPONSE'; }
    }
    else { $response->error = 'MISSING_PARAMETERS'; }
}

//Rewrite this (piggybacking off of my old code).
/*function _List($data): void
{
    global $conn;
    global $response;

    $resultsPerPage = 15;
    $nameSort = null;

    if (isset($data["page"])) //Query has page count ? get query type : return null
    {
        $startIndex = $resultsPerPage * $data["page"] - $resultsPerPage;
        $endIndex = $startIndex + $resultsPerPage;
        //Most queries will be have the same structure aside from the 'where'.
        $sqlBefore = "SELECT overlay.id, overlay.unid, overlay.oname, user.username, overlay.b64
        FROM users user
        LEFT JOIN bsdp_overlay overlay
        ON overlay.unid = user.unid
        WHERE overlay.public = 1";
        $sqlAfter = " ORDER BY overlay.alteredDate
        DESC LIMIT $startIndex, $endIndex";

        //Get searches to sort by relevance then date
        if (isset($data["oname"])) //Query type name
        {
            $nameSort = $data["oname"];
            //$oname = $data["oname"];
            $sql = $sqlBefore . "AND overlay.oname LIKE '%$nameSort%'" . $sqlAfter;
            $csql = "FROM bsdp_overlay WHERE public = 1 AND oname LIKE '%$nameSort%'";
        }
        else if (isset($data["username"])) //Query type username
        {
            $nameSort = $data["username"];
            //$username = $data["username"];
            $sql = $sqlBefore . "AND user.username LIKE '%$nameSort%'" . $sqlAfter;
            $csql = "FROM users user LEFT JOIN bsdp_overlay overlay ON overlay.unid = user.unid WHERE overlay.public = 1 AND user.username LIKE '%$nameSort%'";
        }
        else if (isset($data["all"]))
        {
            $dataAll = $data["all"];
            $sql = $sqlBefore . "AND overlay.oname LIKE '%$dataAll%' OR user.username LIKE '%$dataAll%'" . $sqlAfter;
            $csql = "FROM users user LEFT JOIN bsdp_overlay overlay ON overlay.unid = user.unid WHERE overlay.public = 1 AND overlay.oname LIKE '%$dataAll%' OR user.username LIKE '%$dataAll%'";
        }
        else //Query type undefined (return all results for the page)
        {
            $sql = $sqlBefore . $sqlAfter;
            $csql = "FROM bsdp_overlay WHERE public = 1";
        }

        $result = mysqli_query($conn, $sql);
        $response->data->showingResults = $startIndex . "-" . ($startIndex + mysqli_num_rows($result));
        $response->data->totalResults = countEntries($csql);
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
                $response->data->sortedBy = "similarity";
            }
            else { $response->data->sortedBy = "dateModified"; }

            $response->data->results = $sqlResults;
        }
        else { $response->error = 'NO_OVERLAYS_FOUND'; }
    }
    else { $response->error = 'NO_METHOD_FOUND'; }
}

function countEntries(&$sql)
{
    global $conn;
    $sql = "SELECT COUNT(*) " . $sql;
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) { return array_values(mysqli_fetch_assoc($result))[0]; }
    else { return null; }
}*/