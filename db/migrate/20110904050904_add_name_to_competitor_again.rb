class AddNameToCompetitorAgain < ActiveRecord::Migration
  def self.up
    add_column :competitors, :name, :string
  end

  def self.down
  end
end
