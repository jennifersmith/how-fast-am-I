class AddDisplayFormatToComparison < ActiveRecord::Migration
  def self.up
    add_column :comparisons, :display_format, :string
  end

  def self.down
    remove_column :comparisons, :display_format
  end
end
