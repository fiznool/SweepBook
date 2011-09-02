class CreateDonations < ActiveRecord::Migration
  def self.up
    create_table :donations do |t|
      t.references :event
      t.references :competitor
      t.string :donator_id
      t.string :external_uid
      t.string :value

      t.timestamps
    end
  end

  def self.down
    drop_table :donations
  end
end
