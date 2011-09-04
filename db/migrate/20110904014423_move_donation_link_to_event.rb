class MoveDonationLinkToEvent < ActiveRecord::Migration
  def self.up
    remove_column :competitors, :donation_link
    add_column :events, :donation_link, :string
  end

  def self.down
  end
end
