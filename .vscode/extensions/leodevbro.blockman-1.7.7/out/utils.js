"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullFileStats = exports.stylingLanguages = exports.renderLevels = exports.tabsIntoSpaces = exports.findRenderingInfoForBlock = exports.findArrayOfNLevelsWithArrayOfBlocksInside = exports.getMacroInfoOfFile = exports.generateTextLinesMap = exports.parseTags = exports.findInnerStartersEndersOfTags = exports.findLineZeroAndInLineIndexZero = void 0;
const tagLexer_1 = require("./tagAlgos/tagLexer");
const tagConfigurations_1 = require("./tagAlgos/tagConfigurations");
// import * as babelParser from "@babel/parser";
// import babelTraverse from "@babel/traverse";
// import { File } from "@babel/types";
const vscode = require("vscode");
const extension_1 = require("./extension");
const renderingTools_1 = require("./renderingTools");
const python_algo_1 = require("./pythonAlgos/python-algo");
// import { resolve } from "path";
const utils2_1 = require("./utils2");
const regex_main_1 = require("./helpers/regex-main");
const yaml_algo_1 = require("./yamlAlgos/yaml-algo");
const sqlLexer_1 = require("./sqlAlgos/sqlLexer");
const theFn_1 = require("./rubyAlgos/theFn");
const utils3_1 = require("./utils3");
const findLineZeroAndInLineIndexZero = ({ 
// TODO: editor and doc insert arguments
globalIndexZero, editorInfo, }) => {
    // const pos = doc.positionAt(globalIndexZero);
    // // console.log("doc.positionAt(1):", doc.positionAt(1));
    // return {
    //     lineZero: pos.line,
    //     inLineIndexZero: pos.character,
    // };
    // old implementation:
    const lastLineZero = editorInfo.textLinesMap.length - 1;
    for (let i = 0; i <= lastLineZero; i += 1) {
        if (i === lastLineZero ||
            (globalIndexZero >= editorInfo.textLinesMap[i] &&
                globalIndexZero < editorInfo.textLinesMap[i + 1])) {
            return {
                lineZero: i,
                inLineIndexZero: globalIndexZero - editorInfo.textLinesMap[i],
            };
        }
    }
    return {
        lineZero: -1,
        inLineIndexZero: -1,
    };
};
exports.findLineZeroAndInLineIndexZero = findLineZeroAndInLineIndexZero;
const findInnerStartersEndersOfTags = ({ editorInfo, myString, }) => {
    var _a, _b, _c, _d;
    // console.log(config.emptyElements);
    const tagsList = exports.parseTags(myString, tagConfigurations_1.default.emptyElements);
    // console.log("tagsList:", tagsList);
    let legitTagsList = [];
    for (let i = 0; i < tagsList.length; i += 1) {
        if (((_a = tagsList[i].opening) === null || _a === void 0 ? void 0 : _a.end) &&
            ((_b = tagsList[i].closing) === null || _b === void 0 ? void 0 : _b.start) &&
            ((_c = tagsList[i].opening) === null || _c === void 0 ? void 0 : _c.end) !== ((_d = tagsList[i].closing) === null || _d === void 0 ? void 0 : _d.end)) {
            // console.log("i aris", i, "da is:", tagsList[i].opening?.end);
            const openEnd = tagsList[i].opening.end - 1;
            // console.log("oc:", openEnd, closeStart);
            const lineAndInlineOfOpenEnd = exports.findLineZeroAndInLineIndexZero({
                globalIndexZero: openEnd,
                editorInfo,
            });
            legitTagsList.push({
                globalIndexZero: openEnd,
                lineZero: lineAndInlineOfOpenEnd.lineZero,
                inLineIndexZero: lineAndInlineOfOpenEnd.inLineIndexZero,
                type: "s", // "s" or "e" or other);
            });
            // console.log("i aris", i, "da is:", tagsList[i].opening?.end);
            const closeStart = tagsList[i].closing.start;
            // console.log("oc:", openEnd, closeStart);
            const lineAndInlineOfcloseStart = exports.findLineZeroAndInLineIndexZero({
                globalIndexZero: closeStart,
                editorInfo,
            });
            legitTagsList.push({
                globalIndexZero: closeStart,
                lineZero: lineAndInlineOfcloseStart.lineZero,
                inLineIndexZero: lineAndInlineOfcloseStart.inLineIndexZero,
                type: "e", // "s" or "e" or other);
            });
        }
    }
    // console.log("legitTagsList:", legitTagsList);
    /*
    const findSelfDivs = () => {
        // let starters: IPositionEachZero[] = [];
        // let enders: IPositionEachZero[] = [];

        let mySelfClosingsLastI: IPositionEachZero[] = [];

        // const re_start = /(<[^/][^><]*[^/=]>)|(<[ a-zA-Z]*>)/gimu;
        // const re_end = /<[/][^><]*>/gimu;

        // const selfRegEx = /<([^\/>]+)\/>/gimu;
        // const selfRegEx =
        //     /(<([^\/>]+)\/>)|(<([^\/>]*)([{(]+)([\s\S]*?)\/>)/gimu;
        const selfRegEx = /([^<\s])([\s]*)(\/>)/gimu;

        // myString = "foob<asD></asd>arfoobar";
        let match: any;

        // eslint-disable
        while ((match = selfRegEx.exec(myString)) != null) {
            const first_i = match.index;
            const last_i = first_i + match[0].length - 1;
            // console.log(last_i);
            const lineZeroAndInLineZero = findLineZeroAndInLineIndexZero({
                globalIndexZero: last_i,
                editorInfo,
            });
            mySelfClosingsLastI.push({
                globalIndexZero: last_i,
                lineZero: lineZeroAndInLineZero.lineZero,
                inLineIndexZero: lineZeroAndInLineZero.inLineIndexZero,
                type: "s",
            });
        }

        // eslint-disable
        // while ((match = re_end.exec(myString)) != null) {
        //     const first_i = match.index;
        //     // console.log(first_i);
        //     const lineZeroAndInLineZero =
        //         findLineZeroAndInLineIndexZero(first_i);
        //     enders.push({
        //         globalIndexZero: first_i,
        //         lineZero: lineZeroAndInLineZero.lineZero,
        //         inLineIndexZero: lineZeroAndInLineZero.inLineIndexZero,
        //         type: "e",
        //     });
        // }

        let finalArr = [...mySelfClosingsLastI].sort(
            (a, b) => a.globalIndexZero - b.globalIndexZero,
        );
        // console.log("finalArr:", finalArr);
        return finalArr;
    };*/
    // const selfs = findSelfDivs();
    // const globalsOfSelfs = selfs.map((pos) => pos.globalIndexZero);
    // const superTagList = legitTagsList.filter((pos) => {
    //     if (globalsOfSelfs.includes(pos.globalIndexZero)) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // });
    // const superTagListSorted = superTagList.sort(
    //     (a, b) => a.globalIndexZero - b.globalIndexZero,
    // );
    // return superTagList;
    const sortedTagList = legitTagsList.sort((a, b) => a.globalIndexZero - b.globalIndexZero);
    return sortedTagList;
};
exports.findInnerStartersEndersOfTags = findInnerStartersEndersOfTags;
const parseTags = (text, emptyElements = []) => {
    // Here the tags will be put as they are resolved
    const workingList = [];
    // Looks for last unclosed opening tag, e.g. <div attr=""
    const closeLastOpening = (endPosition) => {
        for (let i = workingList.length - 1; i >= 0; i--) {
            const openingTag = workingList[i].opening;
            if (openingTag && !openingTag.end) {
                openingTag.end = endPosition;
                return openingTag;
            }
        }
        return undefined;
    };
    /*
    Looks for the last "name" tag pair without a matching closing tag;
    Closes any unclosed tags in between;
    Closes the matching tag;
  */
    const closeMatchingOpeningTag = (closingTag, nestingLevel) => {
        const unclosedPairs = [];
        for (let i = workingList.length - 1; i >= 0; i--) {
            const openingTag = workingList[i].opening;
            if (openingTag &&
                openingTag.end &&
                !workingList[i].closing &&
                workingList[i].attributeNestingLevel === nestingLevel &&
                !unclosedPairs.includes(workingList[i])) {
                if (openingTag.name === closingTag.name) {
                    workingList[i].closing = closingTag;
                    return;
                }
                unclosedPairs.push(workingList[i]);
            }
        }
        // No opening tag was found, so we push a pair with closing tag only
        workingList.push({
            attributeNestingLevel: nestingLevel,
            closing: closingTag,
        });
    };
    // Every block inside of attribute has higher level, to avoid matching with outside
    let attributeNestingLevel = 0;
    let lastOpening;
    tagLexer_1.default.reset(text);
    let match = tagLexer_1.default.next();
    while (match !== undefined) {
        switch (match.type) {
            case "tagOpening":
                workingList.push({
                    attributeNestingLevel,
                    opening: {
                        name: match.value.slice(1),
                        start: match.offset,
                    },
                });
                attributeNestingLevel += 1;
                break;
            case "closeTag":
                lastOpening = closeLastOpening(match.offset + 1);
                attributeNestingLevel -= 1;
                if (emptyElements.includes(lastOpening.name)) {
                    closeMatchingOpeningTag(lastOpening, attributeNestingLevel);
                }
                break;
            case "tagSelfClose":
                lastOpening = closeLastOpening(match.offset + 2);
                attributeNestingLevel -= 1;
                closeMatchingOpeningTag(lastOpening, attributeNestingLevel); // comm007
                break;
            case "tagClosing":
                closeMatchingOpeningTag({
                    name: match.value.slice(2, -1),
                    start: match.offset,
                    end: match.offset + match.value.length,
                }, attributeNestingLevel);
                break;
        }
        match = tagLexer_1.default.next();
    }
    return workingList;
};
exports.parseTags = parseTags;
// block start, block end
// let arrayOfLevels__arraysOfBlocks0 = [
//     [
//         { s: 4, e: 105 },
//         { s: 120, e: 130 }
//     ],
//     [
//         { s: 8, e: 50 },
//         { s: 60, e: 100 },
//         { s: 155, e: 160 }
//     ],
//     [
//         { s: 9, e: 40 },
//         { s: 67, e: 90 },
//         { s: 156, e: 157 }
//     ]
// ];
const generateTextLinesMap = (text, editorInfo) => {
    extension_1.dropTextLinesMapForEditor(editorInfo.editorRef);
    for (let i = 0; i < text.length; i += 1) {
        if (i === 0) {
            editorInfo.textLinesMap.push(i);
        }
        if (i > 0 && extension_1.oneCharLineBreaks.includes(text[i - 1])) {
            editorInfo.textLinesMap.push(i);
        }
    }
};
exports.generateTextLinesMap = generateTextLinesMap;
const getMacroInfoOfFile = (editorInfo, workString) => {
    let entireFileLeftMost = 5000;
    let entireFileRightMost = -1;
    let entireFileTopVisLineZero = -1;
    let entireFileBottomVisLineZero = -1;
    let allStartEndIndicators = []; // depricated, obsolete
    let allFirstLastNonWhitesInEachLine = [];
    let currFirstIndex = -1;
    let currFirstIndexInLine = -1;
    let currFirstFound = false;
    let currLastIndex = -1;
    let currLastIndexInLine = -1;
    let wLength = workString.length;
    let currLineZero = 0;
    let currInLineIndexZero = 0;
    // dropTextLinesMapForEditor(editorInfo.editorRef);
    for (let i = 0; i < wLength; i += 1) {
        // if (i === 0) {
        //     editorInfo.textLinesMap.push(i);
        // }
        if (i > 0 && extension_1.oneCharLineBreaks.includes(workString[i - 1])) {
            currLineZero += 1;
            currInLineIndexZero = 0;
            // editorInfo.textLinesMap.push(i);
        }
        // collect firstLastNonWhites
        const doPushFirstLast = () => {
            entireFileLeftMost = Math.min(entireFileLeftMost, currFirstIndexInLine);
            entireFileRightMost = Math.max(entireFileRightMost, currLastIndexInLine);
            if (entireFileTopVisLineZero < 0) {
                entireFileTopVisLineZero = currLineZero;
            }
            entireFileBottomVisLineZero = currLineZero;
            allFirstLastNonWhitesInEachLine.push({
                globalIndexZero: currFirstIndex,
                lineZero: currLineZero,
                inLineIndexZero: currFirstIndexInLine,
                type: "leftMostInLine",
            });
            allFirstLastNonWhitesInEachLine.push({
                globalIndexZero: currLastIndex,
                lineZero: currLineZero,
                inLineIndexZero: currLastIndexInLine,
                type: "RightMostInLine",
            });
        };
        if (!extension_1.allWhiteSpace.includes(workString[i])) {
            // if found visible char
            currLastIndex = i;
            currLastIndexInLine = currInLineIndexZero;
            if (!currFirstFound) {
                currFirstIndex = i;
                currFirstIndexInLine = currInLineIndexZero;
                currFirstFound = true;
            }
        }
        else if (currFirstFound &&
            extension_1.oneCharLineBreaks.includes(workString[i])) {
            currFirstFound = false;
            doPushFirstLast();
        }
        if (i === wLength - 1 && currFirstFound) {
            currFirstFound = false;
            doPushFirstLast();
        }
        currInLineIndexZero += 1;
    }
    return {
        allStartEndIndicators,
        allFirstLastNonWhitesInEachLine,
        entireFileLeftMost,
        entireFileRightMost,
        entireFileTopVisLineZero,
        entireFileBottomVisLineZero,
    };
};
exports.getMacroInfoOfFile = getMacroInfoOfFile;
const findEndIndicatorIndexAsPlace = (allIndicatorsArr, startIndicatorIndexAsPlace) => {
    let numOfInnerStarts = 0; // indicators
    let numOfInnerEnds = 0; // indicators
    for (let i = startIndicatorIndexAsPlace + 1; i < allIndicatorsArr.length; i += 1) {
        if (allIndicatorsArr[i].type === "e") {
            if (numOfInnerStarts === numOfInnerEnds) {
                return i;
            }
            else {
                numOfInnerEnds += 1;
            }
        }
        else if (allIndicatorsArr[i].type === "s") {
            numOfInnerStarts += 1;
        }
    }
    return -1;
};
const findSubLevelRangesInRange = (allIndicators, rStart, rEnd) => {
    let subLevelRanges = [];
    let thisStart = -1;
    let thisEnd = -1;
    for (let p = rStart; p < rEnd; p += 1) {
        if (p <= thisEnd) {
            continue;
        }
        if (allIndicators[p].type === "s") {
            thisStart = p;
            thisEnd = findEndIndicatorIndexAsPlace(allIndicators, p);
            if (thisEnd >= 0 && thisStart >= 0) {
                subLevelRanges.push({
                    s: thisStart,
                    e: thisEnd,
                    outerIndexInOuterLevel: null,
                });
            }
        }
    }
    return subLevelRanges;
};
const findArrayOfNLevelsWithArrayOfBlocksInside = (allIndicators, maxDepth) => {
    if (maxDepth <= -1) {
        return [];
    }
    let arrayOfNLevelsWithArrayOfBlocksInside = [findSubLevelRangesInRange(allIndicators, 0, allIndicators.length)];
    for (let i = 1; i <= maxDepth; i += 1) {
        const outerLevel = i - 1;
        let prevLevelArr = arrayOfNLevelsWithArrayOfBlocksInside[outerLevel];
        if (prevLevelArr) {
            let newLevelArr = [];
            for (let j = 0; j < prevLevelArr.length; j += 1) {
                let innerRanges = findSubLevelRangesInRange(allIndicators, prevLevelArr[j].s + 1, prevLevelArr[j].e);
                innerRanges.forEach((item) => {
                    item.outerIndexInOuterLevel = j;
                });
                if (innerRanges && innerRanges.length > 0) {
                    // newLevelArr.push(nextR);
                    newLevelArr = [...newLevelArr, ...innerRanges];
                }
            }
            if (newLevelArr.length > 0) {
                arrayOfNLevelsWithArrayOfBlocksInside.push(newLevelArr);
            }
            else {
                return arrayOfNLevelsWithArrayOfBlocksInside;
            }
        }
    }
    return arrayOfNLevelsWithArrayOfBlocksInside;
};
exports.findArrayOfNLevelsWithArrayOfBlocksInside = findArrayOfNLevelsWithArrayOfBlocksInside;
const findRenderingInfoForBlock = ({ editorInfo, range, allFirstLastNonWhites, workString, }) => {
    let firstVisibleChar = { lineZero: -1, inLineIndexZero: -1 };
    let lastVisibleChar = { lineZero: -1, inLineIndexZero: -1 };
    let firstLineHasVisibleChar = false;
    let lastLineHasVisibleChar = false;
    let foundVisibleFromOpening = false;
    let foundLineBreakFromOpening = false;
    for (let i = range.s.globalIndexZero + 1; i < range.e.globalIndexZero; i += 1) {
        if (!foundLineBreakFromOpening &&
            extension_1.oneCharLineBreaks.includes(workString[i])) {
            foundLineBreakFromOpening = true;
        }
        if (!foundVisibleFromOpening &&
            !extension_1.allWhiteSpace.includes(workString[i])) {
            // found visible
            foundVisibleFromOpening = true;
            firstVisibleChar = exports.findLineZeroAndInLineIndexZero({
                editorInfo,
                globalIndexZero: i,
            });
            if (!foundLineBreakFromOpening) {
                firstLineHasVisibleChar = true;
            }
            break;
        }
        if (!foundVisibleFromOpening && i === range.e.globalIndexZero - 1) {
            return null;
        }
    }
    let foundVisibleFromClosing = false;
    let foundLineBreakFromClosing = false;
    if (foundVisibleFromOpening) {
        for (let i = range.e.globalIndexZero - 1; i > range.s.globalIndexZero; i -= 1) {
            if (!foundLineBreakFromClosing &&
                extension_1.oneCharLineBreaks.includes(workString[i])) {
                foundLineBreakFromClosing = true;
            }
            if (!foundVisibleFromClosing &&
                !extension_1.allWhiteSpace.includes(workString[i])) {
                // found visible
                foundVisibleFromClosing = true;
                lastVisibleChar = exports.findLineZeroAndInLineIndexZero({
                    editorInfo,
                    globalIndexZero: i,
                });
                if (!foundLineBreakFromClosing) {
                    lastLineHasVisibleChar = true;
                }
                break;
            }
        }
    }
    let optimalLeftOfRange = firstVisibleChar.inLineIndexZero;
    let optimalRightOfRange = lastVisibleChar.inLineIndexZero;
    for (let i = 0; i < allFirstLastNonWhites.length; i += 1) {
        if (allFirstLastNonWhites[i].globalIndexZero <
            range.s.globalIndexZero + 1) {
            continue;
        }
        else if (allFirstLastNonWhites[i].globalIndexZero >
            range.e.globalIndexZero - 1) {
            break;
        }
        optimalLeftOfRange = Math.min(optimalLeftOfRange, allFirstLastNonWhites[i].inLineIndexZero);
        optimalRightOfRange = Math.max(optimalRightOfRange, allFirstLastNonWhites[i].inLineIndexZero);
    }
    return {
        firstLineHasVisibleChar,
        lastLineHasVisibleChar,
        firstVisibleChar,
        lastVisibleChar,
        optimalLeftOfRange,
        optimalRightOfRange,
    };
};
exports.findRenderingInfoForBlock = findRenderingInfoForBlock;
const tabsIntoSpaces = (text, tabSize) => {
    const tabChar = `\t`;
    const spaceChar = ` `;
    const NL = `\n`;
    const currTextArr = text.split("");
    let finalTextArr = [];
    let currPossibleTabWidth = tabSize;
    currTextArr.map((char) => {
        if (char !== tabChar) {
            finalTextArr.push(char);
            if (char === NL) {
                currPossibleTabWidth = tabSize;
            }
            else if (currPossibleTabWidth > 1) {
                currPossibleTabWidth -= 1;
            }
            else {
                currPossibleTabWidth = tabSize;
            }
        }
        else {
            finalTextArr.push(`${spaceChar.repeat(currPossibleTabWidth)}`);
            currPossibleTabWidth = tabSize;
        }
    });
    return finalTextArr.join("");
};
exports.tabsIntoSpaces = tabsIntoSpaces;
const renderLevels = (editorInfo, firstLineZeroOfRender, lastLineZeroOfRender) => {
    var _a;
    // console.log("analiz-render");
    let renderingInfo = editorInfo.renderingInfoForFullFile;
    const lang = editorInfo.editorRef.document.languageId;
    if (!renderingInfo) {
        return;
    }
    const currMaxDepthIndex = ((_a = editorInfo.renderingInfoForFullFile) === null || _a === void 0 ? void 0 : _a.masterLevels.length) || 0; // it is current max depth, because masterLevels does not include depth 0.
    if (renderingInfo.fileRightMost >= 0) {
        const backgroundCSS = extension_1.glo.coloring.onEachDepth[0];
        const borderColor = extension_1.glo.coloring.borderOfDepth0;
        if (backgroundCSS !== "none" || borderColor !== "none") {
            // ground block
            renderingTools_1.renderSingleBlock({
                firstLineHasVisibleChar: true,
                lastLineHasVisibleChar: true,
                firstVisibleChar: {
                    lineZero: renderingInfo.fileTopVisLineZero,
                    inLineIndexZero: renderingInfo.fileLeftMost,
                },
                lastVisibleChar: {
                    lineZero: renderingInfo.fileBottomVisLineZero,
                    inLineIndexZero: renderingInfo.fileRightMost,
                },
                optimalLeftOfRange: renderingInfo.fileLeftMost,
                optimalRightOfRange: renderingInfo.fileRightMost,
                firstLineZeroOfRender,
                lastLineZeroOfRender,
                depth: 0,
                inDepthBlockIndex: 0,
                editorInfo,
                lang,
                isFocusedBlock: false,
                currMaxDepthIndex,
            });
        }
    }
    // junkDecors3dArr.push(editorInfo.decors); // dangerous
    // editorInfo.decors = []; // dangerous
    // const fDuo = editorInfo.focusDuo; // manage to render and junk only DUO !!!
    // level is same as depth
    // block is same as range
    for (let depthMO = 0; // depthMO -> depth minus one
     depthMO < renderingInfo.masterLevels.length; depthMO += 1) {
        let level = renderingInfo.masterLevels[depthMO];
        for (let blockIndex = 0; blockIndex < level.length; blockIndex += 1) {
            try {
                let absRangeStartPos = renderingInfo.allit[level[blockIndex].s];
                let absRangeEndPos = renderingInfo.allit[level[blockIndex].e];
                if (absRangeEndPos.lineZero < firstLineZeroOfRender) {
                    continue;
                }
                if (absRangeStartPos.lineZero > lastLineZeroOfRender) {
                    break;
                }
                let isFocusedBlock = false;
                // --------------
                const focusedBlock = editorInfo.focusDuo.curr;
                if (focusedBlock &&
                    depthMO + 1 === focusedBlock.depth &&
                    blockIndex === focusedBlock.indexInTheDepth) {
                    isFocusedBlock = true;
                }
                // ------------
                let theR = {
                    s: absRangeStartPos,
                    e: absRangeEndPos,
                };
                const renderingInfoForBlock = exports.findRenderingInfoForBlock({
                    editorInfo,
                    range: theR,
                    allFirstLastNonWhites: renderingInfo.macroInfoOfFile
                        .allFirstLastNonWhitesInEachLine,
                    workString: renderingInfo.txt,
                });
                if (!renderingInfoForBlock) {
                    continue;
                }
                renderingTools_1.renderSingleBlock(Object.assign(Object.assign({}, renderingInfoForBlock), { editorInfo, depth: depthMO + 1, inDepthBlockIndex: blockIndex, firstLineZeroOfRender,
                    lastLineZeroOfRender,
                    lang,
                    isFocusedBlock,
                    absRangeEndPos,
                    currMaxDepthIndex }));
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    // console.log("done one full render:");
};
exports.renderLevels = renderLevels;
// export const getFullFileStatsSecondHelp = (
//     editorInfo: IEditorInfo,
//     document: vscode.TextDocument,
// ) => {
// };
exports.stylingLanguages = ["css", "scss", "sass", "less"];
// For chinese support:
const getFullFileStats = ({ editorInfo, }) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("analiz started");
    // console.log("aqamde vaaartttttttttttttttttttttttt", glo.maxDepth);
    const document = editorInfo.editorRef.document;
    const lang = document.languageId;
    // console.log("iiiiiiiiiiiiii:", lang);
    // let brackets = await bracketManager!.updateDocument(document);
    let txt = document.getText();
    if (exports.getMacroInfoOfFile(editorInfo, txt).entireFileRightMost >
        extension_1.glo.maxCharCountInAnyLine) {
        return;
    }
    if (extension_1.glo.trySupportDoubleWidthChars) {
        txt = txt.replace(regex_main_1.doubleWidthCharsReg, "Z_");
        // console.log("jer");
        // console.log(txt);
    }
    if (document.eol === 2) {
        txt = txt.replace(/\r/g, ``); // may be needed, LF, CRLF
    }
    let tabSize = 4; // default
    const fetchedTabSize = editorInfo.editorRef.options.tabSize;
    if (fetchedTabSize && typeof fetchedTabSize === "number") {
        tabSize = fetchedTabSize;
    }
    txt = exports.tabsIntoSpaces(txt, tabSize);
    txt = txt + `\n\n\n`; // !!! VERY important for tokenizer of Python and other indentation based languages
    if (extension_1.glo.colorDecoratorsInStyles) {
        const nativeColorDecoratorsArr = yield utils3_1.getEditorColorDecoratorsArr(editorInfo.editorRef);
        const codelensItemsLinesSet = yield utils3_1.getEditorCodeLensItemsLinesSet(editorInfo.editorRef);
        editorInfo.codelensItemsLines = codelensItemsLinesSet;
        exports.generateTextLinesMap(txt, editorInfo);
        // const linesArr = txt.split(`\n`);
        // console.log(linesArr);
        // console.log(dataArr);
        if (nativeColorDecoratorsArr && nativeColorDecoratorsArr.length >= 1) {
            const startingPositions = nativeColorDecoratorsArr.map((item) => {
                return {
                    cDLineZero: item.range.start.line,
                    cDCharZeroInDoc: item.range.start.character,
                    cDCharZeroInMonoText: -1,
                    cDGlobalIndexZeroInMonoText: -1,
                };
            });
            const cDArr = startingPositions;
            const doc = editorInfo.editorRef.document;
            for (let i = 0; i < cDArr.length; i += 1) {
                const currSP = cDArr[i];
                const columnIndex = utils2_1.calculateColumnFromCharIndex(doc.lineAt(currSP.cDLineZero).text, currSP.cDCharZeroInDoc, tabSize);
                currSP.cDCharZeroInMonoText = columnIndex;
                currSP.cDGlobalIndexZeroInMonoText =
                    editorInfo.textLinesMap[currSP.cDLineZero] + columnIndex;
            }
            editorInfo.colorDecoratorsArr = startingPositions.sort((a, b) => a.cDGlobalIndexZeroInMonoText -
                b.cDGlobalIndexZeroInMonoText);
            txt = utils2_1.colorDecorsToSpacesForFile(txt, editorInfo);
            exports.generateTextLinesMap(txt, editorInfo);
            // const linesArr = txt.split(`\n`);
            // console.log(linesArr);
            // console.log(startingPositions);
        }
        else {
            editorInfo.colorDecoratorsArr = [];
        }
        /*
        if (stylingLanguages.includes(lang)) {
            txt = txt.replace(/color:/g, `color:  `);
            txt = txt.replace(/background:/g, `background:  `);
            txt = txt.replace(/fill:/g, `fill:  `);
            txt = txt.replace(/stroke:/g, `stroke:  `);
            txt = txt.replace(/border:/g, `border:  `);

            txt = txt.replace(/border-left:/g, `border-left:  `);
            txt = txt.replace(/border-right:/g, `border-right:  `);
            txt = txt.replace(/border-top:/g, `border-top:  `);
            txt = txt.replace(/border-bottom:/g, `border-bottom:  `);

            txt = txt.replace(/shadow:/g, `shadow:  `);

            txt = txt.replace(/gradient\(/g, `    gradient(`);

            // txt = txt.replace(/rgb\(/g, `  rgb(`);
            // txt = txt.replace(/rgba\(/g, `  rgba(`);

            // txt = txt.replace(/hsl\(/g, `  hsl(`);
            // txt = txt.replace(/hsla\(/g, `  hsla(`);
        } else if (["json", "jsonc"].includes(lang)) {
            txt = txt.replace(/Background":/g, `Background":  `);
            txt = txt.replace(/Border":/g, `Border":  `);
            txt = txt.replace(/Color":/g, `Color":  `);
        }
        */
    }
    else {
        exports.generateTextLinesMap(txt, editorInfo);
        editorInfo.colorDecoratorsArr = [];
    }
    editorInfo.monoText = txt;
    let brackets = [];
    let generalStarterBrackets = ["{", "(", "["];
    let generalEnderBrackets = ["}", ")", "]"];
    if ((extension_1.glo.analyzeCurlyBrackets ||
        extension_1.glo.analyzeSquareBrackets ||
        extension_1.glo.analyzeRoundBrackets) &&
        extension_1.glo.maxDepth >= 0 &&
        extension_1.bracketManager &&
        lang !== "plaintext") {
        /*
        if (
            babelParser &&
            ["typescript", "typescriptreact", "tsx"].includes(
                lang,
            )
        ) {
            // if (false) {
            // console.log("shemovediiitttttt");

            const vmap: any = {};
            const rez: IPositionEachZero[] = [];

            let myParsed: File | undefined = undefined;

            try {
                myParsed = babelParser.parse(txt, {
                    // plugins: ["flow", "jsx", "typesript"],
                    plugins: ["flow", "jsx"],
                    sourceType: "module",
                    strictMode: false,
                    tokens: true,
                    errorRecovery: true,

                    // allowImportExportEverywhere: true,
                });

                // myParsed = undefined;
            } catch (err) {
                console.log(err);
            }

            if (myParsed) {
                babelTraverse(myParsed, {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    Scopable: (path) => {
                        // console.log("sdfsdf", vmap[(path.scope as any).uid]);
                        if (vmap[(path.scope as any).uid]) {
                            // console.log("aqad - rettuuuurn");
                            // return;
                        } else {
                            // console.log("aqadaaaa");
                            vmap[(path.scope as any).uid] = 1;
                            console.log("path.node:", path.node);
                            
                            if (
                                (path.node as any).body &&
                                typeof (path.node as any).body.start ===
                                    "number" &&
                                typeof path.node.end === "number"
                            ) {
                                let gS = (path.node as any).body.start;
                                if (!generalStarterBrackets.includes(txt[gS])) {
                                    gS -= 1;
                                }
                                let gE = (path.node as any).body.end - 1;
                                if (!generalEnderBrackets.includes(txt[gE])) {
                                    gE += 1;
                                }

                                const llS = findLineZeroAndInLineIndexZero({
                                    globalIndexZero: gS,
                                    editorInfo,
                                });
                                const llE = findLineZeroAndInLineIndexZero({
                                    globalIndexZero: gE,
                                    editorInfo,
                                });
                                console.log("llE:::", llE.lineZero);

                                rez.push(
                                    {
                                        type: "s",
                                        globalIndexZero: gS,
                                        lineZero: llS.lineZero,
                                        inLineIndexZero: llS.inLineIndexZero,
                                        char: "<",
                                    },
                                    {
                                        type: "e",
                                        globalIndexZero: gE,
                                        lineZero: llE.lineZero,
                                        inLineIndexZero: llE.inLineIndexZero,
                                        char: ">",
                                    },
                                );
                            }
                            
                        }
                    },
                });
            }

            // brackets = [...brackets, ...rez];
            // brackets = rez;
            // console.log("mivanicheeee");
            // console.log("rez:", rez);
            // console.log(rez);

            
        }
        */
        // return;
        let foundbrackets = undefined;
        // console.time("braP");
        if (lang !== "ruby") {
            foundbrackets = extension_1.bracketManager.updateDocument(document, editorInfo);
        }
        // console.timeEnd("braP");
        // lang === "ruby"
        if (foundbrackets) {
            const allBrackets = foundbrackets.map((x) => {
                const globalIndexZero = editorInfo.textLinesMap[x.lineZero] + x.inLineIndexZero;
                let type = "";
                if (generalStarterBrackets.includes(x.char)) {
                    type = "s";
                }
                else if (generalEnderBrackets.includes(x.char)) {
                    type = "e";
                }
                return {
                    globalIndexZero,
                    inLineIndexZero: x.inLineIndexZero,
                    char: x.char,
                    type,
                    lineZero: x.lineZero,
                };
            });
            let curlyBrackets = [];
            if (extension_1.glo.analyzeCurlyBrackets) {
                curlyBrackets = allBrackets.filter((x) => ["{", "}"].includes(x.char));
            }
            let squareBrackets = [];
            if (extension_1.glo.analyzeSquareBrackets) {
                squareBrackets = allBrackets.filter((x) => ["[", "]"].includes(x.char));
            }
            let roundBrackets = [];
            if (extension_1.glo.analyzeRoundBrackets) {
                roundBrackets = allBrackets.filter((x) => ["(", ")"].includes(x.char));
            }
            brackets = [...curlyBrackets, ...squareBrackets, ...roundBrackets];
        }
        else {
            // console.log("aq titqos returnnnnnnnnnnnnnnnnnnnnn");
            // foundbrackets = [];
            // editorInfo.needToAnalyzeFile = true;
            // updateRender({ editorInfo });
            // return; // ::-:
        }
    }
    // const cursorPos = thisEditor.selection.active;
    // console.log("cursorPos:", cursorPos);
    // document.lineAt(cursorPos).range.end.character;
    let pythonBlocks = [];
    let yamlBlocks = [];
    let sqlBlocks = [];
    let rubyBlocks = [];
    // console.log("lang:::::", lang);
    if (extension_1.glo.analyzeIndentDedentTokens && extension_1.glo.maxDepth >= 0) {
        if (lang === "python") {
            // console.log("before py blocks");
            // console.time("parseP");
            pythonBlocks = python_algo_1.pyFn(txt, editorInfo);
            // console.timeEnd("parseP");
            // console.log("after py blocks");
            // txt = txt.replace(/\#/g, ` `); // cool to ignore "#"
        }
        else if (["yaml", "dockercompose"].includes(lang)) {
            // txt = txt.replace(/\/\//g, `  `); // cool to ignore "//"
            yamlBlocks = yaml_algo_1.yamlFn(txt, editorInfo);
        }
        else if (lang === "sql") {
            sqlBlocks = sqlLexer_1.sqlFn(txt, editorInfo);
        }
    }
    if (extension_1.glo.maxDepth >= 0 && lang === "ruby") {
        // console.log("daiwyo rubyyyy");
        // console.time("parseRuby");
        rubyBlocks = theFn_1.rubyFn(txt, editorInfo);
        // console.timeEnd("parseRuby");
        if (!extension_1.glo.analyzeCurlyBrackets ||
            !extension_1.glo.analyzeSquareBrackets ||
            !extension_1.glo.analyzeRoundBrackets) {
            rubyBlocks = rubyBlocks.filter((pos) => {
                const theChar = editorInfo.monoText[pos.globalIndexZero];
                // console.log("theChar::", theChar);
                if (!extension_1.glo.analyzeCurlyBrackets && ["{", "}"].includes(theChar)) {
                    return false;
                }
                else if (!extension_1.glo.analyzeSquareBrackets &&
                    ["[", "]"].includes(theChar)) {
                    return false;
                }
                else if (!extension_1.glo.analyzeRoundBrackets &&
                    ["(", ")"].includes(theChar)) {
                    return false;
                }
                return true;
            });
        }
    }
    // console.log(JSON.stringify(rubyBlocks, null, 2));
    let macroInfoOfFile = exports.getMacroInfoOfFile(editorInfo, txt);
    const fileLeftMost = macroInfoOfFile.entireFileLeftMost;
    const fileRightMost = macroInfoOfFile.entireFileRightMost;
    const fileTopVisLineZero = macroInfoOfFile.entireFileTopVisLineZero;
    const fileBottomVisLineZero = macroInfoOfFile.entireFileBottomVisLineZero;
    // console.log("fileLeftMost:", fileLeftMost);
    // console.log("fileRightMost:", fileRightMost);
    // console.log("fileTopVisLineZero:", fileTopVisLineZero);
    // console.log("fileBottomVisLineZero:", fileBottomVisLineZero);
    // console.log("macroInfoOfFile:", macroInfoOfFile);
    let tagsIt = [];
    if (extension_1.glo.analyzeTags && extension_1.glo.maxDepth >= 0 && lang !== "plaintext") {
        try {
            tagsIt = exports.findInnerStartersEndersOfTags({
                editorInfo,
                myString: txt,
            });
        }
        catch (err) {
            console.log(err);
            vscode.window.showErrorMessage(String(err), { modal: false });
        }
    }
    // console.log("tagsIt:", tagsIt);
    let allit = [
        // ...macroInfoOfFile.allStartEndIndicators,
        ...brackets,
        ...tagsIt,
        ...pythonBlocks,
        ...yamlBlocks,
        ...sqlBlocks,
        ...rubyBlocks,
    ].sort((a, b) => a.globalIndexZero - b.globalIndexZero);
    // console.log("allit:", allit);
    let masterLevels = exports.findArrayOfNLevelsWithArrayOfBlocksInside(allit, extension_1.glo.maxDepth);
    // console.log("masterLevels:", masterLevels);
    return {
        masterLevels: masterLevels,
        allit,
        macroInfoOfFile,
        thisEditor: editorInfo.editorRef,
        txt,
        fileLeftMost,
        fileRightMost,
        fileBottomVisLineZero,
        fileTopVisLineZero,
    };
});
exports.getFullFileStats = getFullFileStats;
// some archive:
/*
setTimeout(async () => {
        const color = new vscode.ThemeColor("badge.background");
        console.log("hiiii", color);

        // vscode.window.showQuickPick(['eeerti', 'ooori', 'saami'], {
        //     title: 'aaba esaa da esss',
            
        // });

        // vscode.window.createTreeView

        const hhhh = await vscode.window.showInputBox({
            placeHolder: 'pleisiii',
            prompt: 'promptiiiiii ii ii i',
            title: 'titlii ii ii iii',
            value: 'valiuuuu',
            
        });

        console.log('hhhhjjjjjjjj:', hhhh);

        //Create output channel
        let orange = vscode.window.createOutputChannel("Prettier2");

        //Write to output.
        orange.appendLine("I am a banana.");

        setTimeout(() => {
            
            orange.appendLine("I am a banana.");
        }, 7000);
    }, 7000);

*/
//# sourceMappingURL=utils.js.map