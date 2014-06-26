<?php

  error_reporting(E_ALL);
  ini_set('display_errors', 1);

  $serverInterface = new TwitterServerInterface();

  foreach ($_GET as $key => $value) {
    switch ( $value ) {

      case 'authenticate':
        header( 'Content-type: application/json' );
        echo json_encode( array( 'token' => $serverInterface->authenticate() ) );
        break;

      default:
        header( 'Content-type: application/json' );
        echo json_encode( array( 'response' => false ) );
        break;
    }

    exit;
  }

  class API {

    public static function call( $url, $options = null, $debug = false ) {

      $ch = curl_init( $url );

      // Configuring curl options
      if ( !isset( $options ) ) {
        $options = array(
          CURLOPT_RETURNTRANSFER => true,
        );
      }

      // Setting curl options
      curl_setopt_array( $ch, $options );

      // Getting results
      if ( $debug ) {
        curl_exec( $ch );
        return curl_error( $ch );
      } else {
        return curl_exec( $ch );
      }
    }

  }

  class TwitterServerInterface {

    /*

      curl --get 'https://api.twitter.com/1.1/statuses/user_timeline.json'
           --data 'screen_name=nocilla'
           --header 'Authorization: OAuth oauth_consumer_key="BFfp4XnV8iQlUo33mPYHEg",
                    oauth_nonce="d79afa3dd294e9fb65a28b01e8dddb54",
                    oauth_signature="hSqqRJRUiUa6O6wRqR9eAOyWYtc%3D",
                    oauth_signature_method="HMAC-SHA1",
                    oauth_timestamp="1394712218",
                    oauth_token="72898842-tsqbvSF8zYB3Cnp9tLLqX2nX1fqkrbQS4stLy6iBS",
                    oauth_version="1.0"'
           --verbose

    */

    private static $oAuth = 'https://api.twitter.com/oauth2/token';
    private static $API = 'https://api.twitter.com/1.1';

    private static $consumerKey = 'ENvQnYTjQcBrChs5eW7QIYuMx';
    private static $consumerSecret = '5R6aJUWfp0s3mdF3WaeBgmn8d9pTyOSfrwtWiik0ydWbxJX8tK';

    private $accessToken = '';

    public function authenticate() {

      /**
       * Oauth Process
       */

      /* Step 1 */

      $token = rawurlencode( self::$consumerKey );
      $token = base64_encode( $token . ':' . self::$consumerSecret );

      /* Step 2 */

      $data = 'grant_type=client_credentials';

      $options = array(
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => true,  // Warning! MitM exposed if set to false!
        CURLOPT_HTTPHEADER => array(
          'Authorization: Basic ' . $token,
          'Content-Type: application/x-www-form-urlencoded;charset=UTF-8'
        ),
        CURLOPT_POSTFIELDS => $data
      );

      $response = json_decode( API::call( self::$oAuth, $options ) );

      if ( isset( $response->access_token ) ) {
        $this->accessToken = $response->access_token;
        return $response->access_token;
      } else {
        return $response;
      }
    }

  }





?>