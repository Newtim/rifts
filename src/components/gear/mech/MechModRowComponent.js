import React from 'react';
import PropTypes from 'prop-types';

import SelectRating from '../SelectRatingComponent';

class MechModRowComponent extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			rating: 1
		};
		this.evil = eval;

		this.updateRating = this.updateRating.bind(this);
		this.calculateStat = this.calculateStat.bind(this);
		this.fixedValues = this.fixedValues.bind(this);

		if (props.mod.rating === 'body') {
			this.selectRating = {
				name: props.mod.name,
				rating: props.mech.body
			};
		}
	}

	updateRating(event) {
		const { value } = event.target;

		this.setState({
			rating: +value
		});
	}

	displayStat(stat) {
		if (/number/.test(stat)) {
			return this.conditionalValue(stat);
		} else if (/FixedValues|Body/.test(stat)) {
			return this.fixedValues(stat);
		} else if (/Vehicle Cost/.test(stat)) {
			return this.evil(stat.replace('Vehicle Cost', this.props.mech.cost));
		} else if (/Rating/.test(stat)) {
			return this.evil(stat.replace('Rating', this.state.rating).replace('R', '+"R"').replace('F', '+"F"'));
		}

		return stat || 'N/A';
	}

	conditionalValue(stat) {
		/* eslint-disable no-unused-vars, no-eval */
		const number = Number;
		return eval(stat.replace(/Body/g, this.props.mech.body).replace('R', '+"R"'));
		/* eslint-enable */
	}

	fixedValues(stat) {
		if (/Accelaration/.test(stat)) {
			return this.calculateStat(stat, 'Acceleration', 'accel');
		} else if (/Handling/.test(stat)) {
			return this.calculateStat(stat, 'Handling', 'handling');
		} else if (/Speed/.test(stat)) {
			return this.calculateStat(stat, 'Speed', 'speed');
		} else if (/Body/.test(stat)) {
			return this.calculateStat(stat, 'Body', 'body');
		}
		const value = stat.match(/\d+/g);
		return value[this.state.rating - 1];
	}

	calculateStat(stat, mechAttribute, attributeKey) {
		const regex = new RegExp(`${mechAttribute}\\s*\\*\\s*\\d+`, 'g'),
			value = stat.match(regex)[this.state.rating - 1],
			attribute = Math.max(...this.props.mech[attributeKey].match(/\d+/g));
		return this.evil(value.replace(mechAttribute, attribute));
	}

	render() {
		const { mod } = this.props;
		return (
			<tr>
				<td className="mech-mod--name">{mod.name}</td>
				<td className="mech-mod--rating">
					<SelectRating item={this.selectRating || mod} updateRating={this.updateRating} />
				</td>
				<td className="mech-mod--slot">{this.displayStat(mod.slots)}</td>
				<td className="mech-mod--avail">{this.displayStat(mod.avail)}</td>
				<td className="mech-mod--cost">{this.displayStat(mod.cost)}&yen;</td>
				<td className="mech-mod--ref">{mod.source} {mod.page}p</td>
			</tr>
		);
	}
}

MechModRowComponent.propTypes = {
	mod: PropTypes.shape({
		name: PropTypes.string.isRequired,
		rating: PropTypes.string.isRequired,
		slot: PropTypes.string,
		avail: PropTypes.string.isRequired,
		cost: PropTypes.string.isRequired,
		source: PropTypes.string.isRequired,
		page: PropTypes.string.isRequired
	}).isRequired,
	mech: PropTypes.shape({
		accel: PropTypes.string.isRequired,
		handling: PropTypes.string.isRequired,
		body: PropTypes.string.isRequired,
		cost: PropTypes.string.isRequired
	}).isRequired
};

export default MechModRowComponent;