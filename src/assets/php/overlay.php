<?php
//Try and sort something out for intellisense when refrencing paths outside the project.
require_once __DIR__ . '/../../../../api/account/accountFunctions.php';
//These database files are very messy and WILL be changed in the future, but for now as I cant be arsed to rewrite it AGAIN, I will be using patched version of them for now.
//THis databaseHelper file is currently only capiable of selecting from one or two tables.
require_once __DIR__ . '/../../../../api/database/databaseHelper.php';
//This file will use the BasicDatabaseHelper class which can select, update, insert and delete from one table.
require_once __DIR__ . '/../../../../api/database/readie/bsdp_overlay.php';
require_once __DIR__ . '/../../../../api/returnData.php';

class Overlay
{
    private static int $resultsPerPage = 10;

    public function __construct(array $_request)
    {
        echo json_encode($this->ProcessRequest($_request));
    }

    private function ProcessRequest(array $_request)
    {
        if (!isset($_request['q'])) { return new ReturnData('NO_QUERY_FOUND', true); }

        $query = json_decode($_request['q'], true);
    
        if (!isset($query['method'])) { return new ReturnData('NO_METHOD_FOUND', true); }
        if (!isset($query['data'])) { return new ReturnData('NO_DATA_FOUND', true); }

        switch ($query['method'])
        {
            case 'getOverlayByID':
                return $this->GetOverlayByID($query['data']);
            case 'getOverlaysBySearch':
                return $this->GetOverlaysBySearch($query['data']);
            case 'createOverlay':
                return $this->CreateOverlay();
            case 'saveOverlay':
                return $this->SaveOverlay($query['data']);
            case 'deleteOverlay':
                return $this->DeleteOverlay($query['data']);
            default:
                return new ReturnData('INVALID_METHOD', true);
        }
    }

    private function DeleteOverlay(array $_data)
    {
        if (!isset($_data['id'])) { return new ReturnData('INVALID_DATA', true); }

        $bsdp_overlay = new bsdp_overlay(true);

        $sessionValid = AccountFunctions::VerifySession();
        if ($sessionValid->error) { return $sessionValid; }
        else if (!$sessionValid->data) { return new ReturnData("SESSION_EXPIRED", true); }

        $currentOverlay = $bsdp_overlay->Select(array('id'=>$_data['id']));
        if ($currentOverlay->error) { return $currentOverlay; }
        else if (count($currentOverlay->data) <= 0) { return new ReturnData("NO_RESULTS", true); }

        if ($_COOKIE['READIE_UID'] !== $currentOverlay->data[0]->uid)
        { return new ReturnData("INVALID_CREDENTIALS", true); }

        $response = $bsdp_overlay->Delete(
            array('id'=>$currentOverlay->data[0]->id),
            true
        );
        if ($response->error) { return $response; }
        else if ($response->data !== true) { return new ReturnData(false, true); }
        else { return $response; }
    }

    private function SaveOverlay(array $_data)
    {
        if (
            !isset($_data['id']) ||
            !isset($_data['name']) ||
            !isset($_data['description']) ||
            !isset($_data['isPrivate']) ||
            !isset($_data['thumbnail']) ||
            !isset($_data['elements'])
        ) { return new ReturnData('INVALID_DATA', true); }

        if (count($_data['elements']) < 1) { return new ReturnData("NOT_ENOUGH_ELEMENTS", true); }

        $bsdp_overlay = new bsdp_overlay(true);

        $sessionValid = AccountFunctions::VerifySession();
        if ($sessionValid->error) { return $sessionValid; }
        else if (!$sessionValid->data) { return new ReturnData("SESSION_EXPIRED", true); }

        $currentOverlay = $bsdp_overlay->Select(array('id'=>$_data['id']));
        if ($currentOverlay->error) { return $currentOverlay; }
        else if (count($currentOverlay->data) <= 0) { return new ReturnData("NO_RESULTS", true); }

        if ($_COOKIE['READIE_UID'] !== $currentOverlay->data[0]->uid)
        { return new ReturnData("INVALID_CREDENTIALS", true); }

        $updatedOverlay = $bsdp_overlay->Update(
            array(
                'name'=>$_data['name'],
                'description'=>$_data['description'],
                'isPrivate'=>$_data['isPrivate'],
                'thumbnail'=>$_data['thumbnail'],
                'elements'=>json_encode($_data['elements']),
            ),
            array(
                'id'=>$currentOverlay->data[0]->id
            )
        );
        if ($updatedOverlay->error) { return $updatedOverlay; }
        else if ($updatedOverlay->data !== true) { return new ReturnData(false, true); }
        else { return $updatedOverlay; }
    }

    //http://readiefur.localhost/bsdp-overlay/assets/php/overlay.php?q={"method":"createOverlay","data":{}}
    private function CreateOverlay()
    {
        global $dbServername;
        global $dbName;
        global $dbUsername;
        global $dbPassword;

        $sessionValid = AccountFunctions::VerifySession();
        if ($sessionValid->error) { return $sessionValid; }
        else if (!$sessionValid->data) { return new ReturnData("SESSION_EXPIRED", true); }

        $dbi = new DatabaseInterface(new PDO("mysql:host=$dbServername:3306;dbname=$dbName", $dbUsername, $dbPassword));
        $count = $dbi
            ->Table1('bsdp_overlay')
            ->SelectCount()
            ->Where(array('uid'=>$_COOKIE['READIE_UID']))
            ->Execute();
        if ($count->error) { return $count; }
        else if (intval($count->data[0]->count) >= 10) { return new ReturnData("QUOTA_EXCEEDED", true); }

        $bsdp_overlay = new bsdp_overlay(true);

        $id = '';
        do
        {
            $id = uniqid();
            $existingIDs = $bsdp_overlay->Select(array('id'=>$id));
            if ($existingIDs->error) { return $existingIDs; }
        }
        while (count($existingIDs->data) > 0);

        $response = $bsdp_overlay->Insert(
            array(
                'id'=>$id,
                'uid'=>$_COOKIE['READIE_UID'],
                'name'=>'Untitled Overlay',
                'dateAltered'=>Time()
            )
        );
        if ($response->error) { return $response; }
        else if ($response->data !== true) { return new ReturnData(true, true); }
        else { return new ReturnData($id); }
    }

    //http://readiefur.localhost/bsdp-overlay/assets/php/overlay.php?q={"method":"getOverlayByID","data":{"id":"123456789"}}
    private function GetOverlayByID(array $_data)
    {
        global $dbServername;
        global $dbName;
        global $dbUsername;
        global $dbPassword;

        if (!isset($_data['id'])) { return new ReturnData('INVALID_DATA', true); }

        $dbi = new DatabaseInterface(new PDO("mysql:host=$dbServername:3306;dbname=$dbName", $dbUsername, $dbPassword));
        $result = $dbi
            ->Table1('bsdp_overlay')
            ->Table2('users')
            ->Select(array('*'), array('username'))
            ->On('uid')
            ->Where(array('id'=>$_data['id']))
            ->Execute();
        if ($result->error) { return $result; }
        else if (count($result->data) <= 0) { return new ReturnData("NO_RESULTS", true); }

        if ($result->data[0]->isPrivate == '1')
        {
            $sessionValid = AccountFunctions::VerifySession();
            if ($sessionValid->error) { return $sessionValid; }
            else if (!$sessionValid->data) { return new ReturnData("SESSION_EXPIRED", true); }

            $account = AccountFunctions::GetUsersByID(array($_COOKIE['READIE_UID']));
            if ($account->error) { return $account; }

            if ($account->data[$_COOKIE['READIE_UID']]->uid !== $result->data[0]->uid)
            { return new ReturnData("INVALID_CREDENTIALS", true); }

            return new ReturnData($result->data[0]);
        }
        else { return new ReturnData($result->data[0]); }
    }

    //http://readiefur.localhost/bsdp-overlay/assets/php/overlay.php?q={"method":"getOverlaysBySearch","data":{"filter":"none","search":"","page":1}}
    //http://readiefur.localhost/bsdp-overlay/assets/php/overlay.php?q={"method":"getOverlaysBySearch","data":{"filter":"name","search":"overlay","page":1}}
    //http://readiefur.localhost/bsdp-overlay/assets/php/overlay.php?q={"method":"getOverlaysBySearch","data":{"filter":"username","search":"kof.readie","page":1}}
    //Tweak for 'my overlays' (private only)
    private function GetOverlaysBySearch(array $_data)
    {
        global $dbServername;
        global $dbName;
        global $dbUsername;
        global $dbPassword;

        if (
            (
                !isset($_data['filter']) ||
                !(
                    $_data['filter'] === 'none' ||
                    $_data['filter'] === 'name' ||
                    $_data['filter'] === 'username'
                )
            ) ||
            !isset($_data['search']) ||
            !isset($_data['page'])
        )
        { return new ReturnData('INVALID_DATA', true); }

        $startIndex = Overlay::$resultsPerPage * (intval($_data['page']) - 1);
        
        $user = false;
        $sessionValid = AccountFunctions::VerifySession();
        if (!$sessionValid->error && $sessionValid->data)
        {
            $account = AccountFunctions::GetUsersByID(array($_COOKIE['READIE_UID']));
            if (!$account->error && isset($account->data[$_COOKIE['READIE_UID']])) { $user = $account->data[$_COOKIE['READIE_UID']]; }
        }

        //This bit is really messy because I never though of this when making the 'where' builder, I patched it up so this would work but it's probably worse than if I just redid it. I can't be arsed to change it right now.
        $t1Where = array();
        $t2Where = array();
        if ($_data['filter'] != 'none')
        {
            if ($_data['filter'] == 'name')
            {
                //WHERE name LIKE search AND (isPrivate=0 OR uid=uid)
                $t1Where = array(
                    array($_data['filter'], 'LIKE', $_data['search']),
                    'AND (',
                    'isPrivate'=>'0'
                );
            }
            else if ($_data['filter'] == 'username')
            {
                //WHERE (isPrivate=0 OR uid=uid) AND username LIKE search
                $t1Where = array(
                    '(', '',
                    'isPrivate'=>'0'
                );
                $t2Where = array(array($_data['filter'], 'LIKE', $_data['search']));
            }
            if ($user !== false)
            {
                $t1Where[] = 'OR';
                $t1Where['uid'] = $user->uid;
            }
            $t1Where[] = ')';
        }
        else
        {
            $t1Where['isPrivate'] = '0';
            if ($user !== false)
            {
                $t1Where[] = 'OR';
                $t1Where['uid'] = $user->uid;
            }
        }

        $pdo = new PDO("mysql:host=$dbServername:3306;dbname=$dbName", $dbUsername, $dbPassword);
        $dbi = new DatabaseInterface($pdo);
        $overlays = $dbi
            ->Table1('bsdp_overlay')
            ->Table2('users')
            //I don't need to get everything here.
            //->Select(array('*'), array('username'))
            ->Select(array('id', 'uid', 'name', 'description', 'thumbnail', 'isPrivate', 'dateAltered'), array('username'))
            ->On('uid')
            ->Where($t1Where, 'AND', $t2Where)
            ->Order('dateAltered')
            ->Limit(Overlay::$resultsPerPage, $startIndex)
            ->Execute();
        if ($overlays->error) { return $overlays; }

        $dbi = new DatabaseInterface($pdo);
        $count = $dbi
            ->Table1('bsdp_overlay')
            ->Table2('users')
            ->SelectCount()
            ->On('uid')
            ->Where($t1Where, 'AND', $t2Where)
            ->Execute();
        if ($count->error) { return $count; }

        $data = new stdClass();
        $data->overlays = $overlays->data;
        $data->overlaysFound = intval($count->data[0]->count);
        $data->startIndex = $startIndex;
        $data->resultsPerPage = Overlay::$resultsPerPage;

        return new ReturnData($data);
    }
}
//new Overlay($_GET);
new Overlay($_POST);