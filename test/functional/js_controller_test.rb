require 'test_helper'

class JsControllerTest < ActionController::TestCase
  test "should get slider" do
    get :slider
    assert_response :success
  end

end
