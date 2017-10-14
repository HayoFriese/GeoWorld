<?php
require_once("classes/recordset.class.php");
require_once("classes/session.class.php");
$session = Session::getInstance();


$action  = isset($_REQUEST['action'])  ? $_REQUEST['action']  : null;
$subject = isset($_REQUEST['subject']) ? $_REQUEST['subject'] : null;
$id      = isset($_REQUEST['id'])      ? $_REQUEST['id']      : null;
 
$a3c = isset($_REQUEST['a3c']) ? $_REQUEST['a3c'] : null;
$HeadOfState = isset($_REQUEST['HeadOfState']) ? $_REQUEST['HeadOfState'] : null;
$term = isset($_REQUEST['term']) ? $_REQUEST['term'] : null;

if (empty($action)) {
    if ((($_SERVER['REQUEST_METHOD'] == 'POST') || 
         ($_SERVER['REQUEST_METHOD'] == 'PUT') || 
         ($_SERVER['REQUEST_METHOD'] == 'DELETE')) && 
             (strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false)) {
         
        $input = json_decode(file_get_contents('php://input'), true);
 
        $action = isset($input['action']) ? $input['action'] : null;
        $subject = isset($input['subject']) ? $input['subject'] : null;
        $data = isset($input['data']) ? $input['data'] : null;
    }
}

// concat action and subject with uppercase first letter of subject
$route = $action . ucfirst($subject); // eg list course becomes listCourse
 
$db = pdoDB::getConnection(); // connect to db
 
//set the header to json because everything is returned in that format
header("Content-Type: application/json");
 
// take the appropriate action based on the action and subject
switch ($route) {  
    case 'checkLogin':
        if($session->getProperty('username') !== ""){
            echo '{"status":"ok", "username": "'.$session->getProperty('username').'", "role": "'.$session->getProperty('role').'"}';
        } else {
            echo '{"status": "error", "message": "No Log in"}';
        }
        break;

    case 'updateHos':
        if($session->getProperty('role') === "admin"){
            if (!empty($data)) {
                $bio = json_decode($data);
                $sqlUpdate = "UPDATE w_Country SET HeadOfState=:HeadOfState WHERE A3Code=:A3Code";
                $rs = new JSONRecordSet();
                $retval = $rs->getRecordSet($sqlUpdate, 
                                            'ResultSet', 
                                            array(':HeadOfState'=>$bio->HeadOfState,
                                                  ':A3Code'=>$bio->A3Code,
                                                )
                                            );
                echo '{"status":"ok"}';
            }
        }
        break;

    case 'updateHos2':
        if($session->getProperty('role') === "admin"){
            if (!empty($a3c)) {
                $sqlUpdate = "UPDATE w_Country SET HeadOfState=:HeadOfState WHERE A3Code=:A3Code";
                $rs = new JSONRecordSet();
                $retval = $rs->getRecordSet($sqlUpdate, 
                                            'ResultSet', 
                                            array(':HeadOfState'=>$HeadOfState,
                                                  ':A3Code'=>$a3c,
                                                )
                                            );
                echo '{"status":"ok"}';
            } else {
                echo '{"status": "error", "message": "Nothing was passed through!"}';
            }
        } else {
            echo '{"status": "error", "message": "You are not logged in!"}';
        }
        break;
    case 'searchTerm':
        $id                = $db->quote($id);

        $sqlCountries = "SELECT w_Country.A3Code, w_Country.Name, Region, Continent
                            FROM w_Country
                            WHERE Continent = $id AND w_Country.Name LIKE '%$term%' ORDER BY w_Country.A3Code, w_Country.Name";

        $rs                = new JSONRecordSet();
        $retval            = $rs->getRecordSet($sqlCountries, 'ResultSet', null);
        echo $retval;

        break;

    case 'listInfo':
        $a3c            =   $db->quote($id);
        $sqlInfo        =   "SELECT w_Country.A3Code, w_Country.Name AS Country, w_Continent.ID AS ContinentID, w_Continent.Name AS Continent,
                                Region, SurfaceArea, IndepYear, w_Country.Population, LifeExpectancy, GNP, LocalName, GovernmentForm, HeadOfState, 
                                w_City.Name AS CapitalCity, w_City.district, w_City.population AS CityPop, w_City.lat, w_City.lng
                            FROM w_Country
                            INNER JOIN w_Continent ON w_Country.Continent = w_Continent.ID
                            LEFT JOIN w_City ON w_Country.Capital = w_City.ID
                            WHERE w_Country.A3Code = $a3c";
        $rs                = new JSONRecordSet();
        $retval            = $rs->getRecordSet($sqlInfo, 'ResultSet', null);
        echo $retval;
        break;

    case 'listInfo2':
        $a3c            =   $db->quote($id);
        $sqlInfo        =   "SELECT w_Country.A3Code, w_Country.Name AS Country, w_Continent.ID AS ContinentID, w_Continent.Name AS Continent,
                                Region, SurfaceArea, IndepYear, w_Country.Population, LocalName, GovernmentForm, 
                                w_City.Name AS CapitalCity, w_City.district, w_City.population AS CityPop, w_City.lat, w_City.lng
                            FROM w_Country
                            INNER JOIN w_Continent ON w_Country.Continent = w_Continent.ID
                            LEFT JOIN w_City ON w_Country.Capital = w_City.ID
                            WHERE w_Country.A3Code = $a3c";
        $rs                = new JSONRecordSet();
        $retval            = $rs->getRecordSet($sqlInfo, 'ResultSet', null);
        echo $retval;
        break;

    case 'listCountries':
        $id                = $db->quote($id);
        $sqlCountries = "SELECT w_Country.A3Code, w_Country.Name, Region, Continent
                            FROM w_Country
                            WHERE Continent = $id ORDER BY w_Country.A3Code, w_Country.Name";
                               
        $rs                = new JSONRecordSet();
        $retval            = $rs->getRecordSet($sqlCountries, 'ResultSet', null);
        echo $retval;
        break;

    case 'listContinents':
        $sqlContinents = "SELECT ID, Name FROM w_Continent";
                        
        $rs         = new JSONRecordSet();
        $retval     = $rs->getRecordSet($sqlContinents, 'ResultSet', null);
        echo $retval;
        break;

    case 'loginUser':
        if(!empty($data)){
            $details = json_decode($data);
            $username   = $details->username; 
            $password = md5($details->password);

            if(!empty($username) && !empty($password)){
                $rs = new JSONRecordSet();  
                $sqlLogin = "SELECT userid, username, password, role FROM w_User WHERE userid =:username AND password=:password";
                $params   = array(':username'=>$username, ':password'=>$password);
                $retval   = $rs->getRecordSet($sqlLogin, 'ResultSet', $params);
             
                if ($retval !== false) {  // store successful login details
                    $session->user = $retval;

                    $array = json_decode($retval);
                    $username;
                    $userid;
                    $role;

                    foreach($array->ResultSet as $value) {
                        if(is_array($value)){
                            foreach($value as $item){
                                $username = $item->username;
                                $userid = $item->userid;
                                $role = $item->role;
                            }
                        }
                    }
                    if(isset($username) && isset($userid) && isset($role)){
                        $session->setProperty('username', $username);
                        $session->setProperty('userid', $userid);
                        $session->setProperty('role', $role);
                        echo '{"status":"ok", "username": "'.$session->getProperty('username').'", "role": "'.$session->getProperty('role').'"}';
                    } else {
                        echo '{"status": "error", "message": "Login Credentials Failed"}';
                    }
                }
                else { // if the log in failed unset any previously set value for user
                    $session->removeKey('user');
                    echo '{"status":{"error":"error", "text":"These Details are Incorrect"}}';
                }
            } else {
                $session->removeKey('user');
                echo '{"status":{"error":"error", "text":"Username and Password are required."}}';
            }

        }

        break;

    case 'logoutUser':
            if(!$session->getProperty('username')){
                echo '{"status":{"error":"error", "text":"You\'re not even logged in!"}}';
            } else {
                if ($session->logout()) {
                    echo '{"status":{"ok":"You have successfully logged out"}}';
                }
                else {
                    echo '{"status":{"error":"error", "text":"Log Out Failed"}}';
                }
            }
        break;
    default:
        echo '{"status":"error", "message":{"text": "default no action taken"}}';
        break;
}
?>