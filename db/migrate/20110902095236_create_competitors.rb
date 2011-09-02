class CreateCompetitors < ActiveRecord::Migration
  def self.up
    create_table :competitors do |t|
      t.references :event
      t.string :facebook_id
      t.string :dontation_link
      t.integer :time_min
      t.integer :time_max
      t.integer :time_integererval
      t.integer :time_result
      t.text :result_story
      t.references :result_option

      t.timestamps
    end
  end

  def self.down
    drop_table :competitors
  end
end
