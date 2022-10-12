import { assert, expect } from 'chai';
import * as path from 'path';
import { FileNodeType } from '../../types/types';
import * as vscode from 'vscode';
import { getData } from '../../parse';

suite('DevDux Test Suite', () => {

	vscode.window.showInformationMessage('DevDux testing underway');

	const entryURL = path.resolve('src/test/test_demo/App.jsx');
	const testURL = path.resolve('src/test/test_demo');

	function dataFetch() :FileNodeType {
		const data = getData(entryURL);
		return data;
	}
	
	const parseOutput = dataFetch();

	const testComps : {[index: string] : any} = {
		App:`${testURL + '/App.jsx'}`,
		MainContainer:`${testURL + '/containers/MainContainer.jsx'}`,
		MarketsContainer: `${testURL + '/containers/MarketsContainer.jsx'}`,
		Market: `${testURL + '/components/Market.jsx'}`,
		MarketsCreator: `${testURL + '/components/MarketCreator.jsx'}`,
		MarketsDisplay: `${testURL + '/components/MarketsDisplay.jsx'}`,
		TotalsDisplay: `${testURL + '/components/TotalsDisplay.jsx'}`,
		CardSlice: `${testURL + '/slices/cardSlice.js'}`,
		MarketSlice: `${testURL + '/slices/marketSlice.js'}`
	  };
  
	const testProps : Array<string> = [
		'fileName',
		'filePath',
		'selected',
		'dispatched',
		'renderedComponents'
	];

	test('Data returned from parse.ts', () => {
		assert.strictEqual(false, !parseOutput );
	});

	test('parse.ts output is type FileNode', () => {
		assert.strictEqual('object', typeof parseOutput);
	});

	suite('FileNode has a property with the key of the filepath for each component', () => {
	  for (let comp in testComps) {
		test(`Property with the key of the filepath for \'${comp}\'`, () => {
			expect(parseOutput).to.include.keys(testComps[comp]);
		  });
		}
    });

	suite('Component tests', () => {
	  for (const comp in parseOutput) {
	    testProps.forEach( prop => {
			test(`${comp} has property \'${prop}\'`, () => {
				expect(parseOutput[comp]).to.include.keys(prop);
			});
		});
	  }

		suite('App imports', () => {

			test('\'imports\' property contains one entry', () => {
			assert.lengthOf(parseOutput[testComps['App']].imports!, 1, 'App contains one import');
			});

			test('\'imports\' property contains an object with property \'MainContainer\'', () => {
				expect(parseOutput[testComps['App']].imports![0]).to.include.keys('MainContainer');
			});

			test('\'MainContainer\' has value file path', () => {
				expect(parseOutput[testComps['App']].imports![0]['MainContainer']).to.equal(testComps['MainContainer']);
			});

		});

		suite('MainContainer imports', () => {

			const mainContImp : Array<string> = [
				'MarketsContainer',
				'TotalsDisplay'
			];

			test('\'imports\' property contains 2 entries', () => {
				assert.lengthOf(parseOutput[testComps['MainContainer']].imports!, 2);
			});

			parseOutput[testComps['MainContainer']].imports!.forEach( (imp, i) => {
				test(`\'imports\' property contains an object with property \'${mainContImp[i]}\'`, () => {
					expect(imp).to.include.keys(mainContImp[i]);
				});
			});
		});

		suite('MarketsContainer imports', () => {

			const marketsContImp : Array<string> = [
				'MarketCreator',
				'MarketDisplay',
				'addCard',
				'deleteCard',
				'addMarketCard',
				'deleteMarketCard',
				'addMarket'
			];

			test('\'imports\' property contains 7 entries', () => {
				assert.lengthOf(parseOutput[testComps['MarketsContainer']].imports!, 7);
			});

			parseOutput[testComps['MarketsContainer']].imports!.forEach( (imp, i) => {
			test(`\'imports\' property contains an object with property \'${marketsContImp[i]}\'`, () => {
				expect(imp).to.include.keys(marketsContImp[i]);
			});

		});
			
		});

    });

});
