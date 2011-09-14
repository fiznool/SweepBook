class AddImageUrlToCompetitor < ActiveRecord::Migration
  def self.up
    add_column :competitors, :image_url, :string
  end

  def self.down
  end
end
