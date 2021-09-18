/**
 * QuillForms Dependencies.
 */
import configApi from '@quillforms/config';
import { Button, TextControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import './style.scss';

const License = () => {
	const license = configApi.getLicense();

	const [ count, setCount ] = useState( 0 ); // counter used for force update.
	const [ licenseKey, setLicenseKey ] = useState( '' );
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);

	const activate = () => {
		const data = new FormData();
		data.append( 'action', 'quillforms_license_activate' );
		data.append( '_nonce', window[ 'qfAdmin' ].license_nonce );
		data.append( 'license_key', licenseKey );

		fetch( `${ window[ 'qfAdmin' ].adminUrl }admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		} )
			.then( ( res ) => res.json() )
			.then( ( res ) => {
				if ( res.success ) {
					configApi.setLicense( res.data );
					setCount( count + 1 );
					createSuccessNotice( '✅ License activated successfully', {
						type: 'snackbar',
						isDismissible: true,
					} );
				} else {
					createErrorNotice( `⛔ ${ res.data ?? 'Error' }`, {
						type: 'snackbar',
						isDismissible: true,
					} );
				}
			} )
			.catch( ( err ) => {
				createErrorNotice( `⛔ ${ err ?? 'Error' }`, {
					type: 'snackbar',
					isDismissible: true,
				} );
			} );
	};

	const update = () => {
		const data = new FormData();
		data.append( 'action', 'quillforms_license_update' );
		data.append( '_nonce', window[ 'qfAdmin' ].license_nonce );

		fetch( `${ window[ 'qfAdmin' ].adminUrl }admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		} )
			.then( ( res ) => res.json() )
			.then( ( res ) => {
				if ( res.success ) {
					configApi.setLicense( res.data );
					setCount( count + 1 );
					createSuccessNotice( '✅ License updated', {
						type: 'snackbar',
						isDismissible: true,
					} );
				} else {
					createErrorNotice( `⛔ ${ res.data ?? 'Error' }`, {
						type: 'snackbar',
						isDismissible: true,
					} );
				}
			} )
			.catch( ( err ) => {
				createErrorNotice( `⛔ ${ err ?? 'Error' }`, {
					type: 'snackbar',
					isDismissible: true,
				} );
			} );
	};

	const deactivate = () => {
		const data = new FormData();
		data.append( 'action', 'quillforms_license_deactivate' );
		data.append( '_nonce', window[ 'qfAdmin' ].license_nonce );

		fetch( `${ window[ 'qfAdmin' ].adminUrl }admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		} )
			.then( ( res ) => res.json() )
			.then( ( res ) => {
				console.log( res );
				if ( res.success ) {
					configApi.setLicense( false );
					setCount( count + 1 );
					createSuccessNotice( '✅ License deactivated', {
						type: 'snackbar',
						isDismissible: true,
					} );
				} else {
					createErrorNotice( `⛔ ${ res.data ?? 'Error' }`, {
						type: 'snackbar',
						isDismissible: true,
					} );
				}
			} )
			.catch( ( err ) => {
				createErrorNotice( `⛔ ${ err ?? 'Error' }`, {
					type: 'snackbar',
					isDismissible: true,
				} );
			} );
	};

	return (
		<div className="quillforms-license-page">
			<h1 className="quillforms-license-page__heading">License</h1>
			<div className="quillforms-license-page__body">
				{ license ? (
					<div>
						<div>
							Status:{ ' ' }
							<span
								className={
									license.status === 'valid'
										? 'quillforms-license-valid'
										: 'quillforms-license-invalid'
								}
							>
								{ license.status_label }
							</span>
						</div>
						<div>Plan: { license.plan_label }</div>
						<div>Expires: { license.expires }</div>
						<div>Last check: { license.last_check }</div>
						<Button isPrimary onClick={ update }>
							Update
						</Button>
						<Button isDanger onClick={ deactivate }>
							Deactivate
						</Button>
						{ license.upgrades && (
							<div>
								<h3>Upgrades:</h3>
								{ Object.values( license.upgrades ).map(
									( upgrade ) => {
										return (
											<a
												href={ upgrade.url }
												target="_blank"
											>
												{ upgrade.plan_label }
											</a>
										);
									}
								) }
							</div>
						) }
					</div>
				) : (
					<div>
						<TextControl
							label="License key"
							onChange={ ( value ) => setLicenseKey( value ) }
						/>
						<Button isPrimary onClick={ activate }>
							Activate
						</Button>
					</div>
				) }
			</div>
		</div>
	);
};

export default License;
