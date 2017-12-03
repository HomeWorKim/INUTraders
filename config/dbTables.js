var exports = module.exports = {};
//for Creating required tables

exports.createTrade = 'CREATE TABLE IF NOT EXISTS Trade (TradeID INT NOT NULL auto_increment, AuthorID INT NOT NULL, Ihave VARCHAR(30), Iwant VARCHAR(30), Title VARCHAR(50), Content TEXT, TradeCatID INT, ItemCatID INT, CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, status INT DEFAULT 1, PRIMARY KEY(TradeID), FOREIGN KEY FK_TradeCatID(TradeCatID) REFERENCES TradeCategory(TradeCatID), FOREIGN KEY FK_ItemCatID(ItemCatID) REFERENCES ItemCategory(ItemCatID))';

exports.createTradeCategory = 'CREATE TABLE IF NOT EXISTS TradeCategory(TradeCatID INT NOT NULL, Category VARCHAR(30), PRIMARY KEY(TradeCatID))';

exports.createItemCategory = 'CREATE TABLE IF NOT EXISTS ItemCategory( ItemCatID INT NOT NULL, Category VARCHAR(30), PRIMARY KEY(ItemCatID))';
