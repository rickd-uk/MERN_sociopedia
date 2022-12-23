import User from '../models/User.js'

/* READ */
export const getUser = async (req, res) => {
	try {
		const { id } = req.params
		const user = await User.findById(id)
		res.status(200).json(user)
	} catch (err) {
		res.status(404).json({ msg: err.message })
	}
}

export const getUserFriends = async (req, res) => {
	try {
		const { id } = req.params
		const user = await User.findById(id)
		let formattedFriends = {}

		const friends = await Promise.all(user.friends.map((id) => User.findById(id)))
		formattedFriends = formatFriends(friends)
		res.status(200).json(formattedFriends)
	} catch (err) {
		res.status(404).json({ msg: err.message })
	}
}

const formatFriends = (friends) => {
	friends.map(({ _id, firstname, lastName, occupation, location, picturePath }) => {
		return { _id, firstname, lastName, occupation, location, picturePath }
	})
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
	try {
		const { id, friendId } = req.params
		const user = await User.findById(id)
		const friend = await User.findById(friendId)
		let formattedFriends = {}

		if (user.friends.includes(friendId)) {
			// add friend -> add id to friend, and vice versa
			user.friends = user.friends.filter((id) => id !== friendId)
			friend.friends = friend.friends.filter((id) => id !== id)
		} else {
			// remove a friend -> remove id from friend, and vice versa
			user.friends.push(friendId)
			friend.friends.push(id)
		}
		await user.save()
		await friend.save()

		const friends = await Promise.all(user.friends.map((id) => User.findById(id)))
		formattedFriends = formatFriends(friends)

		res.status(200).json(formattedFriends)
	} catch (err) {
		res.status(404).json({ msg: err.message })
	}
}
