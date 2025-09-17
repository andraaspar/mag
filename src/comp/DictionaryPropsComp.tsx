import { Dictionary } from '../model/Dictionary'
import { RequiredComp } from './RequiredComp'

export interface DictionaryPropsCompProps {
	_dictionary: Dictionary
	_setDictionary: (v: Dictionary) => void
}

export function DictionaryPropsComp({
	_dictionary,
	_setDictionary,
}: DictionaryPropsCompProps) {
	return (
		<div className='ccc_col ccc_gap_0_5'>
			<div className='ccc_para'>
				<label>
					Név
					<RequiredComp />:
				</label>
				<input
					autoFocus
					value={_dictionary.name}
					onChange={(e) => {
						_setDictionary({ ..._dictionary, name: e.target.value })
					}}
				/>
			</div>
			<div className='ccc_para'>
				<label>
					Első nyelv neve
					<RequiredComp />:
				</label>
				<input
					value={_dictionary.language0}
					onChange={(e) => {
						_setDictionary({
							..._dictionary,
							language0: e.target.value,
						})
					}}
				/>
			</div>
			<div className='ccc_para'>
				<label>
					Második nyelv neve
					<RequiredComp />:
				</label>
				<input
					value={_dictionary.language1}
					onChange={(e) => {
						_setDictionary({
							..._dictionary,
							language1: e.target.value,
						})
					}}
				/>
			</div>
		</div>
	)
}
