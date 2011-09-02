class FixCompetitorDonationLinkName < ActiveRecord::Migration
  def self.up
    rename_column :competitors, :dontation_link, :donation_link
  end

  def self.down
  end
end
