import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const getJWTConfig = async (configservice: ConfigService): Promise<JwtModuleOptions> => {
	return {
		secret: configservice.get('JWT_SECRET')
	}

}