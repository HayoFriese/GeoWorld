<?php
class Session{
   private static $instance;
 
   private function __construct(){
      session_start();
   }
 
   public static function getInstance() {
      if (!isset(self::$instance)) {
         self::$instance = new Session();
      }
      return self::$instance;
   }
 
   public function setProperty( $key, $value ) {
      $_SESSION[ $key ] = $value;
   }
 
   public function getProperty( $key ) {
      $returnValue = "";
      if (isset($_SESSION[$key])) {
         $returnValue = $_SESSION[$key];
      }
      return $returnValue;
   }

   public function logout(){
         session_destroy();
         return "Session Destroyed";
   }
}
?>