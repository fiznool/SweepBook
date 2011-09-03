class AddDefaultToDonationStatus < ActiveRecord::Migration
  def self.up
    change_column :donations, :status, :string, :default => 'unconfirmed'
  end

  def self.down
  end
end
