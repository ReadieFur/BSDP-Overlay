<?php
//Try and sort something out for intellisense when refrencing paths outside the project.
require_once __DIR__ . '/../../../../api/account/accountFunctions.php';
require_once __DIR__ . '/../../../../api/database/databaseHelper.php';
require_once __DIR__ . '/../../../../api/returnData.php';

class Overlay
{
    private static int $resultsPerPage = 15;

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
            default:
                return new ReturnData('INVALID_METHOD', true);
        }
    }

    //http://readie.global-gaming.localhost/bsdp-overlay/assets/php/overlay.php?q={"method":"getOverlayByID","data":{"id":"123456789"}}
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
            if ($account->error) { return $result; }

            if ($account->data[$_COOKIE['READIE_UID']]->uid !== $result->data[0]->uid)
            { return new ReturnData("INVALID_CREDENTIALS", true); }

            return $result;
        }
    }

    //http://readie.global-gaming.localhost/bsdp-overlay/assets/php/overlay.php?q={"method":"getOverlaysBySearch","data":{"filter":"none","search":"","page":1}}
    //http://readie.global-gaming.localhost/bsdp-overlay/assets/php/overlay.php?q={"method":"getOverlaysBySearch","data":{"filter":"name","search":"overlay","page":1}}
    //http://readie.global-gaming.localhost/bsdp-overlay/assets/php/overlay.php?q={"method":"getOverlaysBySearch","data":{"filter":"username","search":"kof.readie","page":1}}
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
        $endIndex = $startIndex + Overlay::$resultsPerPage;
        
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

        $dbi = new DatabaseInterface(new PDO("mysql:host=$dbServername:3306;dbname=$dbName", $dbUsername, $dbPassword));
        $result = $dbi
            ->Table1('bsdp_overlay')
            ->Table2('users')
            ->Select(array('*'), array('username'))
            ->On('uid')
            ->Where($t1Where, 'AND', $t2Where)
            ->Order('alteredDate')
            ->Limit($startIndex, $endIndex)
            ->Execute();
        if ($result->error) { return $result; }

        return $result;
    }
}
new Overlay($_GET);