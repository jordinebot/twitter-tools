<?php

  error_reporting(E_ERROR);
  ini_set('display_errors', 1);

  $serverInterface = new TwitterServerInterface();

  foreach ($_GET as $key => $value) {
    switch ( $value ) {

      case 'authenticate':
        header( 'Content-type: application/json' );
        echo json_encode( array( 'token' => $serverInterface->authenticate() ) );
        break;

      case 'user':
        header( 'Content-type: application/json' );
        print_r( $serverInterface->user() );
        break;

      default:
        break;
    }

    exit;
  }

  class API {

    /*
         █████╗  ██████╗  ██╗
        ██╔══██╗ ██╔══██╗ ██║
        ███████║ ██████╔╝ ██║
        ██╔══██║ ██╔═══╝  ██║
        ██║  ██║ ██║      ██║
        ╚═╝  ╚═╝ ╚═╝      ╚═╝
     */

    public static function call( $call, $options = null, $debug = false ) {

      $url = $call->url;

      if ( $call->method == 'GET' ) {
        $first = true;
        foreach ( $call->params as $key => $value ) {
          if ( $first ) {
            $first = false;
            $url .= '?' . $key . '=' . $value;
          } else {
            $url .= '&' . $key . '=' . $value;
          }
        }
      }

      $ch = curl_init( $url );

      // Configuring curl options
      if ( is_null( $options ) ) {
        $options = array(
          CURLOPT_POST => false,
          CURLOPT_RETURNTRANSFER => true
        );
      }

      // Setting curl options
      curl_setopt_array( $ch, $options );

      // Getting results
      if ( $debug ) {
        curl_exec( $ch );
        return curl_error( $ch );
      } else {
        //return json_encode( array( 'url' => $url, 'call' => $call, 'options' => $options ) );
        return curl_exec( $ch );
      }
    }

  }

  class TwitterServerInterface {

    /*
        ████████╗██╗    ██╗██╗████████╗████████╗███████╗██████╗     ███████╗██████╗ ██╗   ██╗
        ╚══██╔══╝██║    ██║██║╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗    ██╔════╝██╔══██╗██║   ██║
           ██║   ██║ █╗ ██║██║   ██║      ██║   █████╗  ██████╔╝    ███████╗██████╔╝██║   ██║
           ██║   ██║███╗██║██║   ██║      ██║   ██╔══╝  ██╔══██╗    ╚════██║██╔══██╗╚██╗ ██╔╝
           ██║   ╚███╔███╔╝██║   ██║      ██║   ███████╗██║  ██║    ███████║██║  ██║ ╚████╔╝
           ╚═╝    ╚══╝╚══╝ ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝  ╚═══╝
     */

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

    private static $salt = array(
      '+_YMK*o)(<gq$A$I%$O!lItb&G7rgNfV&#<!4]F-7zoH>#hZ8iXUE-~zCwt~M-o{',
      'Vusi4s~Qr n`VmQ~jyx|+7RkuoHS;-PxEJ- |[hnQOo/{@0?Y|qO5v8j3L)bx+m,',
      'zuGx`J|-btQ*9c+@z 4x}$Bt$G%x.-8eC0K7RI|P,xd{ceGz!IZIKuTGU74s#51{',
      'K$YefB,<tf<w-m&w@Wq}GZV&r|,FU`D_r$q476$6rVu^$;&)_UPyhh+ipeWn+vo2',
      'IY%k2FpCHU/AaKjw%+uSXmnUBzdr1C.X6{-K>UR-~ppSq.t~7$A=c!6p;g|VbuOv',
      '(sMy)G{0AQ;B}ujZGKIx) ^-8y6<V [arIdOoqS7;&T`i!?u!(Um+H%R2hg0QWv[',
      'rX$~x{[%-MO$^f>#=2[FZ6ach#:$)G|[|-E`r`WuN`727h^q-p3T~Yf#dH3(4cy=',
      '6.B*-{*2<=X Y20l1{gnT| VEQqB;FTb(_M6qKQHo}V(AYpyvnp6<q5E:)?M>/mt'
    );

    private static $oauthHeader = '
      Authorization: OAuth oauth_consumer_key="%CONSUMER_KEY%",
      oauth_nonce="%NONCE%",
      oauth_signature="%OAUTH_SIGNATURE%",
      oauth_signature_method="HMAC-SHA1",
      oauth_timestamp="%TIMESTAMP%",
      oauth_token="%OAUTH_TOKEN%", oauth_version="1.0"';

    private static $bearerHeader = 'Authorization: Bearer %BEARER_TOKEN%';


    public function setToken( $token ) {
      $fh = fopen( './tokens/.token', 'w+' );
      fwrite( $fh, $token );
    }

    public function getToken() {
      $fh = fopen( 'tokens/.token', 'r+' );
      $token = fread( $fh, filesize( 'tokens/.token' ) );
      return (string) $token;
    }

    private function sign( $call, $nonce, $timestamp ) {

      /* https://dev.twitter.com/docs/auth/creating-signature */

      $string = '';
      $params = array();

      //  Include all oauth_* params on the signature string
      $call->params['oauth_consumer_key'] = self::$consumerKey;
      $call->params['oauth_nonce'] = $nonce;
      $call->params['oauth_signature_method'] = 'HMAC-SHA1';
      $call->params['oauth_timestamp'] = $timestamp;
      $call->params['oauth_token'] = $this->getToken();
      $call->params['oauth_version'] = '1.0';

      foreach ( $call->params as $key => $value )
        $params[rawurlencode( $key )] = rawurlencode( $value );

      ksort( $params );

      $string .= strtoupper( $call->method ) . '&';
      $string .= rawurlencode( $call->url ) . '&';

      $first = true;
      foreach ( $params as $key => $value ) {
        if ( $first ) {
          $first = false;
          $string .= $key . '%3D' . $value;
        } else {
          $string .= '%26' . $key . '%3D' . $value;
        }
      }

      $signatureBaseString = $string;
      $signatureKey = self::$consumerSecret . '&' . $this->getToken();

      $signature = base64_encode( hash_hmac( 'sha1', $signatureBaseString, $signatureKey ) );

      /* return $signatureBaseString; */
      return $signature;

    }

    private function getAuthHeader( $call ) {

      $tags = array(
        '%CONSUMER_KEY%',
        '%NONCE%',
        '%OAUTH_SIGNATURE%',
        '%TIMESTAMP%',
        '%OAUTH_TOKEN%'
      );

      $nonce = sha1( self::$salt[mt_rand( 0, count( self::$salt ) - 1 )] );
      $timestamp = time();

      $values = array(
        self::$consumerKey,                           // oauth_consumer_key
        $nonce,                                       // oauth_nonce
        $this->sign( $call, $nonce, $timestamp ),     // oauth_signature
        $timestamp,
        $this->getToken()
      );

      $header = str_replace( $tags, $values, self::$oauthHeader );
      return explode( ',', $header );
    }

    private function getBearerHeader( $call ) {
      $tags = array(
        '%BEARER_TOKEN%'
      );

      $values = array(
        $this->getToken()
      );

      $header = str_replace( $tags, $values, self::$bearerHeader );
      return explode( ',', $header );
    }

    public function authenticate() {

      /**
       * Oauth Process
       */

      /* Step 1: Encode consumer key and secret */

      $token = rawurlencode( self::$consumerKey );
      $token = base64_encode( $token . ':' . self::$consumerSecret );

      /* Step 2 */

      $data = 'grant_type=client_credentials';

      $options = array(
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => true,  // Always require SSL!
        CURLOPT_HTTPHEADER => array(
          'Authorization: Basic ' . $token,
          'Content-Type: application/x-www-form-urlencoded;charset=UTF-8'
        ),
        CURLOPT_POSTFIELDS => $data
      );

      $response = json_decode( API::call( self::$oAuth, $options ) );

      if ( $response->token_type == 'bearer' ) {
        $this->setToken( $response->access_token );
      }

      return $this->getToken();

    }

    public function user() {

      $post = json_decode( file_get_contents( 'php://input' ) );
      $username = ( mysql_real_escape_string( $post->username ) ? mysql_real_escape_string( $post->username ) : false );

      if ( $username !== false ) {

        $call = (object) array(
          'method' => 'GET',
          'url'    => self::$API . '/users/show.json',
          'params' => array(
            'screen_name' => $username
          )
        );

        $options = array(
          CURLOPT_POST => false,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_HTTPHEADER => $this->getBearerHeader( $call )
        );

        $response = API::call( $call, $options );

      } else {

        $response = json_encode( array( 'response' => false ) );

      }

      return $response;
    }

  }





?>