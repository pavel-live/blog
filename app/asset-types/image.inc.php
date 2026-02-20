<?php

Class Image extends Asset {
  
  static $identifiers = array('jpg', 'jpeg', 'gif', 'png');
  
  function __construct($file_path) {
    # create and store data required for this asset
    parent::__construct($file_path);
    # create and store additional data required for this asset
    $this->set_extended_data($file_path);
  }
  
  function set_extended_data($file_path) {
    $small_version_path = preg_replace('/(\.[\w\d]+?)$/', '_sml$1', $this->link_path);
    $large_version_path = preg_replace('/(\.[\w\d]+?)$/', '_lge$1', $this->link_path);
    
    # if a matching _sml version exists, set @small
    $small_relative_path = preg_replace('/(\.\.\/)+/', './', $small_version_path);
    if(file_exists($small_relative_path) && !is_dir($small_relative_path)) {
      $this->data['@small'] = $small_version_path;
    }
    
    # if a matching _lge version exists, set @large
    $large_relative_path = preg_replace('/(\.\.\/)+/', './', $large_version_path);
    if(file_exists($large_relative_path) && !is_dir($large_relative_path)) {
      $this->data['@large'] = $large_version_path;
    }
    
    
    # set @width & @height variables
    $img_data = getimagesize($file_path, $info);
    $w = $img_data[0];
    $h = $img_data[1];
    
    # set @ratio
    $ratio = "square";
    $ratio_aspect = "normal";
    $ratio_size = 1;
    
    if ($w > $h)
    	{
    		$ratio = "horizontal";
    		$ratio_size = $w/$h;
	    	
    	}
    else if ($w < $h)
    	{
    		$ratio = "vertical";
    		$ratio_size = $h/$w;
    	}
    	
    if ($ratio_size < 1.25) $ratio = "square";
    else if ($ratio_size > 1.5 && $ratio_size < 1.9) $ratio_aspect = "long";
    else if ($ratio_size > 1.9 && $ratio_size < 2.9) $ratio_aspect = "very-long";
    else if ($ratio_size > 2.5) $ratio_aspect = "extra-long";

    $this->data['@ratio'] = $ratio;
    $this->data['@aspect'] = $ratio_aspect;
    $this->data['@width'] = $w."";
    $this->data['@height'] = $h."";
    

	$getColors = self::getImageColor($file_path,6);
	$hexColors = array_keys($getColors);

	$this->data['@maincolor'] = $hexColors[0]."";
	$this->data['@firstcolor'] = $hexColors[1]."";
	$this->data['@lastcolor'] = $hexColors[2]."";
	$rgbColors = self::getHtml2Rgb($hexColors[0]);
	if (self::isDark($rgbColors)) $this->data['@imagedark'] ='yes';


/*    
    # set iptc variables
    if(isset($info["APP13"])) {                         
      $iptc = iptcparse($info["APP13"]);
      # @title
      if(isset($iptc["2#005"][0]))
        $this->data['@title'] = $iptc["2#005"][0];
      # @description
      if(isset($iptc["2#120"][0])) 
        $this->data['@description'] = $iptc["2#120"][0];
      # @keywords
      if(isset($iptc["2#025"][0])) 
        $this->data['@keywords'] = $iptc["2#025"][0];
    }
*/
    
  }
  
  function getImageColor($imageFile_URL, $numColors)
	{
   		$error = 33;
   		$image_granularity = max(1, abs((int)$image_granularity));
   		$colors = array();
   		
   		//find image size
   		$size = @getimagesize($imageFile_URL);
   		
   		if($size === false)
	   		{
	      		user_error("Unable to get image size data");
	      		return false;
	   		}
   		
   		$PREVIEW_WIDTH    = 150;  //WE HAVE TO RESIZE THE IMAGE, BECAUSE WE ONLY NEED THE MOST SIGNIFICANT COLORS.
		$PREVIEW_HEIGHT   = 150;
		
		$scale=1;
			
		if ($size[0]>0) $scale = min($PREVIEW_WIDTH/$size[0], $PREVIEW_HEIGHT/$size[1]);
		
		if ($scale < 1)
			{
				$width = floor($scale*$size[0]);
				$height = floor($scale*$size[1]);
			}
		else
			{
				$width = $size[0];
				$height = $size[1];
			}
			
		$image_resized = imagecreatetruecolor($width, $height);
		
		if ($size[2]==1) $image_orig=imagecreatefromgif($imageFile_URL);
		if ($size[2]==2) $image_orig=imagecreatefromjpeg($imageFile_URL);
		if ($size[2]==3) $image_orig=imagecreatefrompng($imageFile_URL);
		
   		if(!$image_orig)
   		{
   	  		user_error("Unable to open image file");
   		   return false;
   		}
		
		imagecopyresampled($image_resized, $image_orig, 0, 0, 0, 0, $width, $height, $size[0], $size[1]); //WE NEED NEAREST NEIGHBOR RESIZING, BECAUSE IT DOESN'T ALTER THE COLORS
		
		$img = $image_resized;
		$imgWidth = imagesx($img);
		$imgHeight = imagesy($img);

   		// fetch color in RGB format
   		for($x = 0; $x < $imgWidth; $x++)
   		{
      		for($y = 0; $y < $imgHeight; $y++)
      		{
         		$thisColor = imagecolorat($img, $x, $y);
         		$rgb = imagecolorsforindex($img, $thisColor);

        		$red = round(round(($rgb['red'] / $error)) * $error);
         		$green = round(round(($rgb['green'] / $error)) * $error);
         		$blue = round(round(($rgb['blue'] / $error)) * $error);
				
				$red = ($red>255) ? 255 : $red;
				$green = ($green>255) ? 255 : $green;
				$blue = ($blue>255) ? 255 : $blue;
				
				$red = dechex($red);
				$green = dechex($green);
				$blue = dechex($blue);
				
				$red = (strlen($red) == 1) ? '0'.$red : $red;
				$green = (strlen($green) == 1) ? '0'.$green : $green;
				$blue = (strlen($blue) == 1) ? '0'.$blue : $blue;
				
				
         		//$thisRGB = sprintf('%02X%02X%02X', $red, $green, $blue);
				//$thisRGB = dechex($red).dechex($green).dechex($blue);
				$thisRGB = $red.$green.$blue;
				
         		if(array_key_exists($thisRGB, $colors))
         		{
           			 $colors[$thisRGB]++;
         		}
         		else
         		{
           			 $colors[$thisRGB] = 1;
         		}
      		}
   		}
   		arsort($colors);
   	
   		// returns maximum used color of image format like #C0C0C0.
   		return array_slice(($colors), 0, $numColors,true);
	}

	// html color to convert in RGB format color like R(255) G(255) B(255)  
	function getHtml2Rgb($str_color)
	{
    	if ($str_color[0] == '#')
        	$str_color = substr($str_color, 1);

  	  	if (strlen($str_color) == 6)
        	list($r, $g, $b) = array($str_color[0].$str_color[1],
                                 $str_color[2].$str_color[3],
                                 $str_color[4].$str_color[5]);
    	elseif (strlen($str_color) == 3)
        	list($r, $g, $b) = array($str_color[0].$str_color[0], $str_color[1].$str_color[1], $str_color[2].$str_color[2]);
    	else
        	return false;

    	$r = hexdec($r); $g = hexdec($g); $b = hexdec($b);
    	$arr_rgb = array($r, $g, $b);
		// Return colors format like R(255) G(255) B(255)  
    	return $arr_rgb;
	}
	
	// html color to convert in RGB format color like R(255) G(255) B(255)  
	function isDark($str_color)
	{
  	  	if (count($str_color) == 3)
  	  		{
	        	$GrayScale = (0.299 * $str_color[0]) + (0.587 * $str_color[1]) + (0.114 * $str_color[2]);
	        	if ( $GrayScale < 128 ) return true;
	        }
	        
    	return false;
	}
  
}


?>