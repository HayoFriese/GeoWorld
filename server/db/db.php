<?php
	class pdoDB{
		//private statics to hold the connection
		private static $dbConnection = null;

		//make the next two functions private to prevent normal class instantiation
		private function __construct(){

		}
		private function __clone(){

		}
		/**
		* Return DB Connection or create initial connection
		* @return object (PDO)
		* @access public
		*/
		public static function getConnection(){
			//if there isn't a connection, then make one
			if (!self::$dbConnection){
				try{
					//SQLite
						self::$dbConnection = new PDO('sqlite:geodata.sqlite','root','');
					//SQL
						//self::$dbConnection = new PDO('mysql:host=localhost;dbname=geodata','root','');
					self::$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				}
				catch(PDOException $e){
					//in a production system you would log the rror not display it
					echo $e->getMessage();
				}
			}
			//return the connection
			return self::$dbConnection;
		}
	}
?>