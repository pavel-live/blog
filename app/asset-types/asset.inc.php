<?php

Class Asset {
  
  var $data;
  var $link_path;
  var $file_name;
  static $identifiers;
  
  function __construct($file_path) {
    # create and store data required for this asset
    $this->set_default_data($file_path);
  }
  
  function construct_link_path($file_path) {
    return preg_replace('/^\.\//', Helpers::relative_root_path(), $file_path);
  }
  
  function set_default_data($file_path) {
    # store link path
    $this->link_path = $this->construct_link_path($file_path);

			$thisfilesize = filesize($file_path); // Размер файла в байтах
		    $txt_formats = array('B','Kb','Mgb','Ggb','Tb'); // варианты размера файла
		    $txt_format = 0; // формат размера по-умолчанию
		    
		    // прогоняем цикл
		    while ($thisfilesize > 1024 && count($txt_formats) != ++$txt_format)
		    {
		        $thisfilesize = round($thisfilesize / 1024, 2);
		    }
		    // размер файла в массив еще раз
		    $txt_formats[] = 'Tb';

    # extract filename from path
    $split_path = explode('/', $file_path);
    $this->file_name = array_pop($split_path);
    
    $content_folder_reg = ereg_replace('\.', '\.', Config::$content_folder);
    $content_folder_reg = ereg_replace('\/', '\/', $content_folder_reg);
    $content_folder_reg = '/^'.$content_folder_reg.'/';
    
    # set @url & @name variables
    $this->data['@url'] = $this->link_path;
    $this->data['@file_name'] = $this->file_name;
    $this->data['@file_path'] = $file_path;
    $this->data['@render_file_path'] = preg_replace($content_folder_reg, '', $file_path);
    
    $this->data['@file_size'] = $thisfilesize.' '.$txt_formats[$txt_format];
    $this->data['@extention'] = end(explode('.', $this->file_name));
    
    $this->data['@name'] = ucfirst(preg_replace(array('/[-_]/', '/\.[\w\d]+?$/', '/^\d+?\./'), array(' ', '', ''), $this->file_name));
  }
  
}

?>