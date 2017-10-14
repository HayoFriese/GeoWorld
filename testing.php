<?php
  require_once("server/classes/session.class.php");
  $session = Session::getInstance();
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Geoworld</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="resources/css/app.css" />
    </head>
    <body>
      <h1>PHP Testing</h1>
      <ul>
        <li><a href="server/index.php?action=list&amp;subject=continents">Show All Continents</a></li>
      
        <li><a href="server/index.php?action=list&amp;subject=countries&amp;id=EU">Show All Countries In Europe</a></li>
        <li><a href="server/index.php?action=search&amp;subject=term&amp;id=EU&amp;term=fra">Show Search Results for "FRA"</a></li>
        <?php
          if($session->getProperty('role') === "admin"){
            echo "<li><a href=\"server/index.php?action=list&amp;subject=info&amp;id=NLD\">Show Netherlands Country Information</a></li>";
          } else {
            echo "<li><a href=\"server/index.php?action=list&amp;subject=info2&amp;id=NLD\">Show Netherlands Country Information</a></li>";
          }
        ?>
        <li><a href="server/index.php?action=update&amp;subject=hos2&amp;a3c=ABW&amp;HeadOfState=Willem%20Alexander">Edit Aruba Head of State</a></li>
        <li><a href="server/index.php?action=update&amp;subject=hos2&amp;a3c=ABW&amp;HeadOfState=Beatrix">Edit Aruba Head of State Again</a></li>
      </ul>
      
    </body>
</html>