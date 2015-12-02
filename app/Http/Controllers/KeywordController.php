<?php 
namespace App\Http\Controllers;
//use Illuminate\Routing\Controller;
use App\Keywords;


class KeywordController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| Home Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders your application's "dashboard" for users that
	| are authenticated. Of course, you are free to change or remove the
	| controller as you wish. It is just here to get your app started!
	|
	*/

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function index(){
		
		return view('keyword');
	}

	public function keylist(){
		
		$keys = Keywords::getAllKeys();
		
		return $keys;
	}

	/*public function addkey($keyword){

	}*/

}
