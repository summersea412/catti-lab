import React from 'react';
import './companion.css';
export default function CompanionIllustration({character='blue',variant='encourage',size='medium',anchor='bottom-right',className=''}){
  return <span className={['companion-slot','companion-'+character,'companion-size-'+size,'companion-anchor-'+anchor,className].join(' ')} data-variant={variant} data-character={character} aria-label="学习伙伴预留位置" />;
}
