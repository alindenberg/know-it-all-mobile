import React from 'react'
import {
	View,
	Text,
	Button,
	TextInput
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { _onLogout, _onPasswordChange } from '../services/Auth'

export default class SettingsScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showChangeUsername: false,
			error: null,
			accessToken: null,
			user: this.props.navigation.getParam("user"),
			text: null
		}

		AsyncStorage.getItem("accessToken").then(token => {
			this.setState({ accessToken: token })
		})
	}
	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				{!this.state.showChangeUsername ?
					<View style={{ flexDirection: 'column' }}>
						<Button onPress={() => this.setState({ showChangeUsername: true })} title="Change Username" />
						<Button
							onPress={() => {
								_onPasswordChange().then(() => {
									Alert.alert(
										'Email Sent!',
										'Check your inbox for a link to change your password.',
										[{ text: 'OK', onPress: () => console.log('OK Pressed') }],
										{ cancelable: false },
									);
								})
							}}
							title="Change Password"
						/>
						<Button
							onPress={() => {
								_onLogout().then(() => {
									AsyncStorage.removeItem('idToken')
									AsyncStorage.removeItem('accessToken')
									this.props.navigation.navigate('Login')
								})
							}}
							title="Logout"
						/>
					</View>
					:
					<View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
						<TextInput
							autoCapitalize='none'
							style={{ fontSize: 30, textAlign: 'center' }}
							placeholder={"New Username"}
							onChangeText={text => {
								this.setState({ text: text, error: null })
							}} />
						{this.state.error ? <Text style={{ fontSize: 10, color: 'red' }}>Error: {this.state.error}</Text> : null}
						<Button
							onPress={() => {
								if (this.state.text.length < 5 || this.state.text.length > 20) {
									this.setState({ error: "Username must be between 5 and 20 characters in length." })
								} else {
									fetch(`http://localhost:8080/users/${this.state.user.UserID}/username`, {
										method: 'POST',
										headers: {
											ContentType: 'application/json',
											authorization: this.state.accessToken
										},
										body: JSON.stringify({ username: this.state.text })
									}).then(async res => {
										if (res.status == 400) {
											var errorMessage = await res.json().then(error => error.error)
											this.setState({ error: errorMessage })
										} else {
											this.state.user.Username = this.state.text
											this.setState(this.state)
										}
									})
								}
							}
							}
							disabled={this.state.text == null || this.state.text == "" || this.state.text == this.state.user.Username}
							title="Save Username" />
						<Button onPress={() => this.setState({ showChangeUsername: false })} title="Cancel" />
					</View>
				}
			</View>
		)
	}
}