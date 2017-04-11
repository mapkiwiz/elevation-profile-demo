import React from 'react';
import {Link} from 'react-router-dom';

export function MenuLink(props, context) {

  let linkTo = props.to || '/';

  return (
    <Link to={ linkTo } className="pull-right">
      <span className="glyphicon glyphicon-home"></span>
    </Link>
  );

}
