class AddChoiceToDonation < ActiveRecord::Migration
  def self.up
    add_column :donations, :choice, :string 
  end

  def self.down
  end
end
