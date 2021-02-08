import NeoModel from "./NeoModel";
import { v4 } from "uuid"
import bcrypt from "bcrypt"
import ProfileData from "./interfase";
import env from "../env";

interface ProfileSignUp {
  name: string,
  email: string,
  password: string
}

class Profile extends NeoModel{
  async fetchAll(): Promise<void> {
    console.log('Feth all profiles');
  }
  async fetch(id: string): Promise<void> {
    const profile = await this.session.run('Match')
    console.log('Fetch single profile', id)
  }
  async add(data: Partial<ProfileData>): Promise<void> {
    const id: string = v4()
    const password: string = await bcrypt.hash(data.password!, env.saltRounds)
    await this.session.run(`CREATE (n:Profile {name: ${data.name!}, email: ${data.email!}, password: ${password}, id: ${id})`)
  }
}

export default new Profile();