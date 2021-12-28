 
/**
 * GSUB
 * -------------
 * - uint16 /	major/minor Version -> 0x00010000
 * - Offset16 / scriptListOffset
 * - Offset16 / featureListOffset
 * - Offset16 / lookupListOffset
 * - new version: Offset32 / featureVariationsOffset
 */

 function GSUBProcessor(data) {
  var buff = new ArrayBuffer(10);
}


/**
 * scriptListOffset
 * ----------------
 * 
 * - Script List table (ScriptList)
 * - Script record (ScriptRecord)
 * - Script table and its language system record (LangSysRecord)
 * - Language System table (LangSys)
 * - Feature List Table (FeatureList)
 * - Feature Table
 * - Lookup List Table
 * - Lookup Table
 * 
 * -----
 * Script -> Language Systems -> Features -> Lookups
 */


/**
 * ScriptList/ScriptRecord
 * -----------------------
 * 
 * - GSUB -> uses ScriptList TO get Glyps Subsituaion Table
 * - GPOB -> uses ScriptList TO get Glyps Positioning Table
 * -----
 * 
 * ScriptList table
 * -----
 * - unit16 / scriptCount / Number of ScriptRecords
 * - ScriptRecord / ScriptRecord[scriptCount] / Array of ScriptRecords, listed alphabetically by script tag
 * -----
 * 
 * ScriptRecord
 * -----
 * - Tag / scriptTag / 4-byte script tag identifier
 * - Offset16 / scriptOffset / Offset to Script table, from beginning of ScriptList
 */



/**
 * LangSysRecord
 * -------------
 * 
 * Script table
 * -----
 * - Offset16       /	defaultLangSysOffset              / Offset to default LangSys table, from beginning of Script table — may be NULL
 * - uint16         / langSysCount                      / Number of LangSysRecords for this script — excluding the default LangSys
 * - LangSysRecord  / langSysRecords[langSysCount]      / Array of LangSysRecords, listed alphabetically by LangSys tag
 * 
 * LangSysRecord
 * -----
 * Tag              / langSysTag                        / 4-byte LangSysTag identifier
 * Offset16         / langSysOffset                     / Offset to LangSys table, from beginning of Script table
 */


/**
 * LangSys
 * -------
 * - Offset16        / lookupOrderOffset                 / = NULL (reserved for an offset to a reordering table)
 * - uint16          / requiredFeatureIndex              / Index of a feature required for this language system; if no required features = 0xFFFF
 * - uint16          / featureIndexCount                 / Number of feature index values for this language system — excludes the required feature
 * - uint16          / featureIndices[featureIndexCount] / Array of indices into the FeatureList, in arbitrary order
 * 
 */


/**
 * FeatureList
 * -----------
 * 
 * FeatureList table
 * -----
 * - uint16 / featureCount / Number of FeatureRecords in this table
 * - FeatureRecord / featureRecords[featureCount] / Array of FeatureRecords — zero-based (first feature has FeatureIndex = 0), listed alphabetically by feature tag
 * -----
 * 
 * FeatureRecord
 * -----
 * - Tag / featureTag / 4-byte feature identification tag
 * - Offset16 / featureOffset / Offset to Feature table, from beginning of FeatureList
 */



/**
 * Feature Table
 * -------------
 * 
 * - Offset16 / featureParamsOffset / Offset from start of Feature table to FeatureParams table, if defined for the feature and present, else NULL
 * - uint16 / lookupIndexCount / Number of LookupList indices for this feature
 * - uint16 / lookupListIndices[lookupIndexCount] / Array of indices into the LookupList — zero-based (first lookup is LookupListIndex = 0)
 */



/**
 * Lookup List Table
 * -----------------
 * 
 * - uint16 / lookupCount / Number of lookups in this table
 * - Offset16 / lookupOffsets[lookupCount] / Array of offsets to Lookup tables, from beginning of LookupList — zero based (first lookup is Lookup index = 0)
 */



/**
 * Lookup Table
 * ------------
 * 
 * uint16 / lookupType / Different enumerations for GSUB and GPOS
 * uint16 / lookupFlag / Lookup qualifiers
 * uint16 / subTableCount / Number of subtables for this lookup
 * Offset16 / subtableOffsets[subTableCount] / Array of offsets to lookup subtables, from beginning of Lookup table
 * uint16 / markFilteringSet / Index (base 0) into GDEF mark glyph sets structure. This field is only present if the USE_MARK_FILTERING_SET lookup flag is set.
 */