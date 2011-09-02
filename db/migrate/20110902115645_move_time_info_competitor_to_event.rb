class MoveTimeInfoCompetitorToEvent < ActiveRecord::Migration
  def self.up
    add_column :events, :time_min, :integer
    add_column :events, :time_max, :integer
    add_column :events, :time_interval, :integer, :default => 5
    remove_column :competitors, :time_min
    remove_column :competitors, :time_max
    remove_column :competitors, :time_interval
  end

  def self.down
  end
end
