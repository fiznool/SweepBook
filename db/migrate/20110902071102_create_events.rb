class CreateEvents < ActiveRecord::Migration
  def self.up
    create_table :events do |t|
      t.string :name
      t.datetime :date
      t.text :info
      t.boolean :forcewallpostsoff
      t.boolean :forceanonymousdonations

      t.timestamps
    end
  end

  def self.down
    drop_table :events
  end
end
