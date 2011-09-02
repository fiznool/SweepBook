class FixCompetitorTimeIntervalName < ActiveRecord::Migration
  def self.up
    rename_column :competitors, :time_integererval, :time_interval
  end

  def self.down
  end
end
