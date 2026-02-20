<?php
 
Class Xml extends Asset {
  
  static $identifiers = array('xml');
  
  function __construct($file_path) {
    # create and store data required for this asset
    parent::__construct($file_path);
    # create and store additional data required for this asset
    $this->set_extended_data($file_path);
  }

  function set_extended_data($file_path) {
  
	# получили название шаблона
    $this->data['@template_name'] = preg_replace('/\.xml$/', '', $this->data['@file_name']);
    
    # добавляем префикс xml-
    # для пространства имен
    $this->data['@template_name'] = "xml-".$this->data['@template_name'];

    if(is_readable($file_path) && $this->data['@template_name']) {
	
		ob_start();
		# взяли необходимый шаблон
		$template = TemplateParser::get_partial_template($this->data['@template_name']);
		# Получили данные из XML
		$xml = (file_exists($file_path)) ? simplexml_load_file($file_path) : '';
		$counterRow = 0;

		if($xml)
		{
			foreach ($xml->xpath('/data/*') as $row) {
						
						$counterRow = $counterRow+1;
						# получаем все необходимые значения из XML
						# в формате: Поле  = Значение
						# и Атрибут&Поле = Значение
						foreach ($row as $node) {
							$nameVar = "@".$node->getName();
							$this->data[$nameVar]= (string)$node;
							$this->data['@counter'] = ''.$counterRow;
							
								foreach ($node->attributes() as $attr => $attrValue) {
									$nameVar= "@".$attr."&".$node->getName();
								    $this->data[$nameVar]= (string)$attrValue;
								}
						}
						
					# Сортируем массив по ключам
					# это важно для корректной работы атрибутов
					krsort($this->data);
					
					# Обнуляем массив полученных значений
					# чтобы исключить повторы
						# Вначале резервируем нужные нам системные переменные
							$tmp_file_name = $this->data['@file_name'];
							$tmp_name = $this->data['@name'];
							$tmp_template = $this->data['@template_name'];
							# вместе с копированием переменных, сохраняем новые данные, собранные с шаблоном
							//$tmp_content = $this->data['@content']."\n". Page::parse_template();
							$tmp_content = $this->data['@content']. "\n". TemplateParser::parse($this->data,$template);
						# потом удаляем целиком массив
							$this->data = array();
						# и восстанавливаем системные переменные
							$this->data['@file_name'] = $tmp_file_name;
							$this->data['@name'] = $tmp_name;
							$this->data['@content'] = $tmp_content;
							$this->data['@template_name'] = $tmp_template;
			}
		}
		ob_end_clean();
		
//print TemplateParser::get_partial_template($this->data['@template_name']);
//print_r($this->data);
    } else {
      $this->data['@content'] = '';
    }
  }
  

  
}

?>