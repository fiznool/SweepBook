class AddStatusToDonation < ActiveRecord::Migration
  def self.up
    add_column :donations, :status, :string 
  end

  def self.down
  end
end
