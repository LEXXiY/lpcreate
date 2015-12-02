<?php
namespace App;
use Illuminate\Database\Eloquent\Model as Eloquent;

class Keywords extends Eloquent {
	protected $table = 'keyword';

	public static function getAllKeys(){
		$keywords = Keywords::all();

		return json_decode($keywords);
	}
}