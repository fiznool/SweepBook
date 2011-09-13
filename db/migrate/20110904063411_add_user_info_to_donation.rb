class AddUserInfoToDonation < ActiveRecord::Migration
  def self.up
    add_column :donations, :facebook_id, :string
    add_column :donations, :donator_name, :string
    add_column :donations, :donator_email, :string
  end

  def self.down
  end
end
